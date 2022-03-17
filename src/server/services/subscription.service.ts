import { Campaign } from 'data/models';
import { SubscriptionRepository } from 'data/repositories';

export default class SubscriptionService {
  static create(createBody: {
    email: string;
    dob: Date;
    consented: boolean;
    campaign: Campaign;
    firstName?: string;
    gender?: string;
    createdAt?: Date;
  }) {
    return SubscriptionRepository.create(createBody);
  }

  static get(id: string) {
    return SubscriptionRepository.get(id);
  }

  static getAll(args: any) {
    return SubscriptionRepository.getAll(args);
  }

  static getAllByPks(pks: number[]) {
    return SubscriptionRepository.getAllByPks(pks);
  }

  static update(updateBody: {
    id: string;
    email: string;
    dob: Date;
    consented: boolean;
    campaign: Campaign;
    firstName: string;
    gender: string;
    createdAt: Date;
  }) {
    return SubscriptionRepository.update(updateBody);
  }

  static partialUpdate(updateBody: {
    id: string;
    email?: string;
    dob?: Date;
    consented?: boolean;
    campaign?: Campaign;
    firstName?: string;
    gender?: string;
    createdAt?: Date;
  }) {
    return SubscriptionRepository.partialUpdate(updateBody);
  }

  static destroy(id: string) {
    return SubscriptionRepository.destroy(id);
  }
}
