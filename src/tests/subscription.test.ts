import { getRepository } from 'typeorm';
import request from 'supertest';
import { Subscription, Campaign } from 'data/models';
import { app } from 'server/app';
import { buildSubscription, buildCampaign, createSubscription, createCampaign } from './factories';
import { Database, setUpRoutesAndMiddlewares } from './utils';

const ENDPOINT = 'api/v1/subscriptions';

describe('Subscription tests', () => {
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

  test('/POST - Response with a new created subscription', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const fakeSubscription = await buildSubscription({ campaign: relFakeCampaign });

    const subscriptionBody = {
      ...fakeSubscription,
      campaign: relFakeCampaign.id,
    };

    const response = await request(app).post(ENDPOINT).send(subscriptionBody);

    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseSubscription = response.body.data;

    const subscription = await subscriptionRepository.findOne(responseSubscription.id, {
      relations: ['campaign'],
    });

    expect(subscription.email).toBe(fakeSubscription.email);
    expect(subscription.firstName).toBe(fakeSubscription.firstName);
    expect(subscription.gender).toBe(fakeSubscription.gender);
    expect(new Date(subscription.dob)).toStrictEqual(fakeSubscription.dob);
    expect(subscription.consented).toBe(fakeSubscription.consented);
    expect(new Date(subscription.createdAt)).toStrictEqual(fakeSubscription.createdAt);

    expect(subscription.campaign.id).toBe(fakeSubscription.campaign.id);
  });

  test('/POST - campaign does not exist, subscription cant be created', async () => {
    const campaignRepository = getRepository(Campaign);

    const fakeSubscription = await buildSubscription({});
    const fakeSubscriptionBody = {
      ...fakeSubscription,
      campaign: fakeSubscription.campaign.id,
    };

    await campaignRepository.delete(fakeSubscription.campaign.id);

    const response = await request(app).post(ENDPOINT).send(fakeSubscriptionBody);
    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/GET - Response with a subscription', async () => {
    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const subscription = await buildSubscription({
      campaign: relFakeCampaign,
    });
    const fakeSubscription = await createSubscription(subscription);

    const response = await request(app).get(`${ENDPOINT}/${fakeSubscription.id}`);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    expect(data.id).toBe(fakeSubscription.id);
    expect(data.email).toBe(fakeSubscription.email);
    expect(data.firstName).toBe(fakeSubscription.firstName);
    expect(data.gender).toBe(fakeSubscription.gender);
    expect(data.dob).toBe(fakeSubscription.dob);
    expect(data.consented).toBe(fakeSubscription.consented);
    expect(new Date(data.createdAt)).toStrictEqual(fakeSubscription.createdAt);

    expect(data.campaign.id).toBe(fakeSubscription.campaign.id);
  });

  test('/GET - Response with a subscription not found', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const subscription = await buildSubscription({});
    const fakeSubscription = await createSubscription(subscription);
    const { id } = fakeSubscription;
    await subscriptionRepository.delete(fakeSubscription.id);

    const response = await request(app).get(`${ENDPOINT}/${id}`);
    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });

  test('/GET - Response with a list of subscriptions', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const response = await request(app).get(ENDPOINT);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    const allSubscriptions = await subscriptionRepository.find();
    expect(data.length).toBe(allSubscriptions.length);
  });

  test('/PUT - Response with an updated subscription', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const subscription = await buildSubscription({ campaign: relFakeCampaign });
    const fakeSubscription = await createSubscription(subscription);

    const anotherCampaign = await buildCampaign({});
    const anotherrelFakeCampaign = await createCampaign(anotherCampaign);

    const anotherFakeSubscription = await buildSubscription({ campaign: anotherrelFakeCampaign });

    const { id } = fakeSubscription;

    const response = await request(app).put(`${ENDPOINT}/${fakeSubscription.id}`).send({
      email: anotherFakeSubscription.email,
      firstName: anotherFakeSubscription.firstName,
      gender: anotherFakeSubscription.gender,
      dob: anotherFakeSubscription.dob,
      consented: anotherFakeSubscription.consented,
      createdAt: anotherFakeSubscription.createdAt,
      campaign: anotherFakeSubscription.campaign.id,
    });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.email).toBe(anotherFakeSubscription.email);
    expect(data.firstName).toBe(anotherFakeSubscription.firstName);
    expect(data.gender).toBe(anotherFakeSubscription.gender);
    expect(new Date(data.dob)).toStrictEqual(anotherFakeSubscription.dob);
    expect(data.consented).toBe(anotherFakeSubscription.consented);
    expect(new Date(data.createdAt)).toStrictEqual(anotherFakeSubscription.createdAt);
    expect(data.campaign.id).toBe(anotherFakeSubscription.campaign.id);

    const updatedSubscription = await subscriptionRepository.findOne(id, {
      relations: ['campaign'],
    });

    expect(updatedSubscription.email).toBe(anotherFakeSubscription.email);
    expect(updatedSubscription.firstName).toBe(anotherFakeSubscription.firstName);
    expect(updatedSubscription.gender).toBe(anotherFakeSubscription.gender);
    expect(new Date(updatedSubscription.dob)).toStrictEqual(anotherFakeSubscription.dob);
    expect(updatedSubscription.consented).toBe(anotherFakeSubscription.consented);
    expect(new Date(updatedSubscription.createdAt)).toStrictEqual(
      anotherFakeSubscription.createdAt,
    );

    expect(updatedSubscription.campaign.id).toBe(anotherFakeSubscription.campaign.id);
  });

  test('/PUT - campaign does not exists, subscription cant be updated', async () => {
    const campaignRepository = getRepository(Campaign);
    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const subscription = await buildSubscription({ campaign: relFakeCampaign });
    const fakeSubscription = await createSubscription(subscription);

    const anotherCampaign = await buildCampaign({});
    const anotherrelFakeCampaign = await createCampaign(anotherCampaign);

    subscription.campaign = anotherrelFakeCampaign;

    await campaignRepository.delete(anotherrelFakeCampaign.id);

    const response = await request(app).put(`${ENDPOINT}/${fakeSubscription.id}`).send({
      email: subscription.email,
      firstName: subscription.firstName,
      gender: subscription.gender,
      dob: subscription.dob,
      consented: subscription.consented,
      createdAt: subscription.createdAt,
      campaign: subscription.campaign.id,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PUT - Subscription does not exists, subscription cant be updated', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const subscription = await buildSubscription({});
    const fakeSubscription = await createSubscription(subscription);
    const { id } = fakeSubscription;
    await subscriptionRepository.delete(id);

    const response = await request(app).put(`${ENDPOINT}/${id}`).send({
      email: subscription.email,
      firstName: subscription.firstName,
      gender: subscription.gender,
      dob: subscription.dob,
      consented: subscription.consented,
      createdAt: subscription.createdAt,
      campaign: subscription.campaign.id,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Response with an updated subscription (no updates)', async () => {
    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const subscription = await buildSubscription({ campaign: relFakeCampaign });
    const fakeSubscription = await createSubscription(subscription);

    const response = await request(app).patch(`${ENDPOINT}/${fakeSubscription.id}`).send({});

    const { status } = response;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
  });

  test('/PATCH - Response with an updated subscription', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const subscription = await buildSubscription({ campaign: relFakeCampaign });
    const fakeSubscription = await createSubscription(subscription);
    const { id } = fakeSubscription;

    const anotherCampaign = await buildCampaign({});
    const anotherrelFakeCampaign = await createCampaign(anotherCampaign);

    const anotherFakeSubscription = await buildSubscription({ campaign: anotherrelFakeCampaign });

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeSubscription.id}`)
      .send({ email: anotherFakeSubscription.email });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.email).toBe(anotherFakeSubscription.email);

    const updatedSubscription = await subscriptionRepository.findOne(id);

    expect(updatedSubscription.email).toBe(anotherFakeSubscription.email);
  });

  test('/PATCH - campaign does not exists, subscription cant be updated', async () => {
    const campaignRepository = getRepository(Campaign);
    const subscription = await buildSubscription({});
    const fakeSubscription = await createSubscription(subscription);

    const relCampaign = await buildCampaign({});
    const relFakeCampaign = await createCampaign(relCampaign);

    const relFakeCampaignId = relFakeCampaign.id;
    await campaignRepository.delete(relFakeCampaign.id);

    const response = await request(app).patch(`${ENDPOINT}/${fakeSubscription.id}`).send({
      campaign: relFakeCampaignId,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Subscription does not exists, subscription cant be updated', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const subscription = await buildSubscription({});
    const fakeSubscription = await createSubscription(subscription);
    const { id } = fakeSubscription;
    const { email } = fakeSubscription;
    await subscriptionRepository.delete(id);

    const response = await request(app).patch(`${ENDPOINT}/${id}`).send({ email });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/DELETE - Response with a deleted subscription', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const subscription = await buildSubscription({});
    const fakeSubscription = await createSubscription(subscription);

    const response = await request(app).delete(`${ENDPOINT}/${fakeSubscription.id}`);

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.id).toBe(fakeSubscription.id);

    const deletedSubscription = await subscriptionRepository.findOne(fakeSubscription.id);
    expect(deletedSubscription).toBe(undefined);
  });

  test('/DELETE - Subscription does not exists, subscription cant be deleted', async () => {
    const subscriptionRepository = getRepository(Subscription);
    const subscription = await buildSubscription({});
    const fakeSubscription = await createSubscription(subscription);
    const { id } = fakeSubscription;
    await subscriptionRepository.delete(id);

    const response = await request(app).delete(`${ENDPOINT}/${id}`);

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
});
