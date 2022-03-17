import { date, random } from 'faker';
import { getRepository } from 'typeorm';
import { Campaign } from 'data/models';
import { dateToUTC } from 'server/utils/functions';

interface CampaignRelations {}

async function buildCampaign(campaign: CampaignRelations): Promise<Campaign> {
  const resCampaign = new Campaign();

  resCampaign.name = random.word().slice(0, 255);
  resCampaign.createdAt = new Date(dateToUTC(date.past()).format('YYYY-MM-DDTHH:mm:ss[.000Z]'));

  return Promise.resolve(resCampaign);
}

async function createCampaign(fakeCampaign: Campaign): Promise<Campaign> {
  const repository = getRepository(Campaign);
  const campaign = repository.create(fakeCampaign);
  await repository.save(campaign);

  return campaign;
}

export { buildCampaign, createCampaign };
