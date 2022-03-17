import { getRepository } from 'typeorm';
import { Campaign } from 'data/models';
import { NotFound } from 'server/utils/errors';

export default class CampaignRepository {
  static async create(createBody: { name?: string; createdAt?: Date }) {
    const campaignRepository = getRepository(Campaign);
    const createdCampaign: Campaign = campaignRepository.create(createBody);
    return campaignRepository.save(createdCampaign);
  }

  static get(id: string) {
    const campaignRepository = getRepository(Campaign);
    return campaignRepository.findOne({
      where: { id },
      relations: ['subscriptions'],
    });
  }

  static getAll(filters: any) {
    const campaignRepository = getRepository(Campaign);
    return campaignRepository.find({
      where: filters,
      relations: ['subscriptions'],
    });
  }

  static getAllByPks(pks: number[]) {
    const campaignRepository = getRepository(Campaign);
    return campaignRepository.findByIds(pks);
  }

  static async update(updateBody: { id: string; name: string; createdAt: Date }) {
    return this.partialUpdate(updateBody);
  }

  static async partialUpdate(updateBody: { id: string; name?: string; createdAt?: Date }) {
    const campaignRepository = getRepository(Campaign);
    const foundCampaign: Campaign = await campaignRepository.findOne(updateBody.id);

    if (!foundCampaign) throw new NotFound(`Campaign with primary key ${updateBody.id} not found`);
    if (updateBody.name !== undefined) foundCampaign.name = updateBody.name;
    if (updateBody.createdAt !== undefined) foundCampaign.createdAt = updateBody.createdAt;
    await campaignRepository.save(foundCampaign);
    return foundCampaign;
  }

  static async destroy(id: string) {
    const campaignRepository = getRepository(Campaign);
    const foundCampaign = await campaignRepository.findOne(id);

    if (!foundCampaign) throw new NotFound(`Campaign with primary key ${id} not found`);

    await campaignRepository.delete(id);
    return foundCampaign;
  }
}
