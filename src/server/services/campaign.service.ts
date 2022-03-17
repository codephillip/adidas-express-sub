import { CampaignRepository } from 'data/repositories';

export default class CampaignService {
  static create(createBody: { name?: string; createdAt?: Date }) {
    return CampaignRepository.create(createBody);
  }

  static get(id: string) {
    return CampaignRepository.get(id);
  }

  static getAll(args: any) {
    return CampaignRepository.getAll(args);
  }

  static getAllByPks(pks: number[]) {
    return CampaignRepository.getAllByPks(pks);
  }

  static update(updateBody: { id: string; name: string; createdAt: Date }) {
    return CampaignRepository.update(updateBody);
  }

  static partialUpdate(updateBody: { id: string; name?: string; createdAt?: Date }) {
    return CampaignRepository.partialUpdate(updateBody);
  }

  static destroy(id: string) {
    return CampaignRepository.destroy(id);
  }
}
