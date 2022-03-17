import { getRepository } from 'typeorm';
import request from 'supertest';
import { Campaign } from 'data/models';
import { app } from 'server/app';
import { buildCampaign, createCampaign } from './factories';
import { Database, setUpRoutesAndMiddlewares } from './utils';

const ENDPOINT = '/api/v1/campaigns';

describe('Campaign tests', () => {
  beforeAll(async () => {
    await Database.startDatabase();
    setUpRoutesAndMiddlewares();
  });

  afterAll(async () => {
    Database.dropDatabase();
  });

  beforeEach(async () => {
    await Database.connection.synchronize(true);
  });

  test('/POST - Response with a new created campaign', async () => {
    const campaignRepository = getRepository(Campaign);

    const fakeCampaign = await buildCampaign({});

    const campaignBody = {
      ...fakeCampaign,
    };
    delete campaignBody.subscriptions;

    const response = await request(app).post(ENDPOINT).send(campaignBody);

    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseCampaign = response.body.data;

    const campaign = await campaignRepository.findOne(responseCampaign.id, {
      relations: [],
    });

    expect(campaign.name).toBe(fakeCampaign.name);
    expect(new Date(campaign.createdAt)).toStrictEqual(fakeCampaign.createdAt);
  });

  test('/GET - Response with a campaign', async () => {
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);

    const response = await request(app).get(`${ENDPOINT}/${fakeCampaign.id}`);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    expect(data.id).toBe(fakeCampaign.id);
    expect(data.name).toBe(fakeCampaign.name);
    expect(new Date(data.createdAt)).toStrictEqual(fakeCampaign.createdAt);

    expect(data.subscriptions).toEqual([]);
  });

  test('/GET - Response with a campaign not found', async () => {
    const campaignRepository = getRepository(Campaign);
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);
    const { id } = fakeCampaign;
    await campaignRepository.delete(fakeCampaign.id);

    const response = await request(app).get(`${ENDPOINT}/${id}`);
    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });

  test('/GET - Response with a list of campaigns', async () => {
    const campaignRepository = getRepository(Campaign);
    const response = await request(app).get(ENDPOINT);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    const allCampaigns = await campaignRepository.find();
    expect(data.length).toBe(allCampaigns.length);
  });

  test('/PUT - Response with an updated campaign', async () => {
    const campaignRepository = getRepository(Campaign);

    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);

    const anotherFakeCampaign = await buildCampaign({});

    const { id } = fakeCampaign;

    const response = await request(app).put(`${ENDPOINT}/${fakeCampaign.id}`).send({
      name: anotherFakeCampaign.name,
      createdAt: anotherFakeCampaign.createdAt,
    });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.name).toBe(anotherFakeCampaign.name);
    expect(new Date(data.createdAt)).toStrictEqual(anotherFakeCampaign.createdAt);

    const updatedCampaign = await campaignRepository.findOne(id, { relations: [] });

    expect(updatedCampaign.name).toBe(anotherFakeCampaign.name);
    expect(new Date(updatedCampaign.createdAt)).toStrictEqual(anotherFakeCampaign.createdAt);
  });

  test('/PUT - Campaign does not exists, campaign cant be updated', async () => {
    const campaignRepository = getRepository(Campaign);
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);
    const { id } = fakeCampaign;
    await campaignRepository.delete(id);

    const response = await request(app).put(`${ENDPOINT}/${id}`).send({
      name: campaign.name,
      createdAt: campaign.createdAt,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Response with an updated campaign (no updates)', async () => {
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);

    const response = await request(app).patch(`${ENDPOINT}/${fakeCampaign.id}`).send({});

    const { status } = response;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
  });

  test('/PATCH - Response with an updated campaign', async () => {
    const campaignRepository = getRepository(Campaign);

    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);
    const { id } = fakeCampaign;

    const anotherFakeCampaign = await buildCampaign({});

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeCampaign.id}`)
      .send({ name: anotherFakeCampaign.name });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.name).toBe(anotherFakeCampaign.name);

    const updatedCampaign = await campaignRepository.findOne(id);

    expect(updatedCampaign.name).toBe(anotherFakeCampaign.name);
  });

  test('/PATCH - Campaign does not exists, campaign cant be updated', async () => {
    const campaignRepository = getRepository(Campaign);
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);
    const { id } = fakeCampaign;
    const { name } = fakeCampaign;
    await campaignRepository.delete(id);

    const response = await request(app).patch(`${ENDPOINT}/${id}`).send({ name });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/DELETE - Response with a deleted campaign', async () => {
    const campaignRepository = getRepository(Campaign);
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);

    const response = await request(app).delete(`${ENDPOINT}/${fakeCampaign.id}`);

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.id).toBe(fakeCampaign.id);

    const deletedCampaign = await campaignRepository.findOne(fakeCampaign.id);
    expect(deletedCampaign).toBe(undefined);
  });

  test('/DELETE - Campaign does not exists, campaign cant be deleted', async () => {
    const campaignRepository = getRepository(Campaign);
    const campaign = await buildCampaign({});
    const fakeCampaign = await createCampaign(campaign);
    const { id } = fakeCampaign;
    await campaignRepository.delete(id);

    const response = await request(app).delete(`${ENDPOINT}/${id}`);

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
});
