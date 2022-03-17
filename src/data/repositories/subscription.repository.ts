import { getRepository } from 'typeorm';
import { Subscription, Campaign } from 'data/models';
import { NotFound } from 'server/utils/errors';

export default class SubscriptionRepository {
  static async create(createBody: {
    email: string;
    dob: Date;
    consented: boolean;
    campaign: Campaign;
    firstName?: string;
    gender?: string;
    createdAt?: Date;
  }) {
    const subscriptionRepository = getRepository(Subscription);
    const createdSubscription: Subscription = subscriptionRepository.create(createBody);
    return subscriptionRepository.save(createdSubscription);
  }

  static get(id: string) {
    const subscriptionRepository = getRepository(Subscription);
    return subscriptionRepository.findOne({
      where: { id },
      relations: ['campaign'],
    });
  }

  static getAll(filters: any) {
    const subscriptionRepository = getRepository(Subscription);
    return subscriptionRepository.find({
      where: filters,
      relations: ['campaign'],
    });
  }

  static getAllByPks(pks: number[]) {
    const subscriptionRepository = getRepository(Subscription);
    return subscriptionRepository.findByIds(pks);
  }

  static async update(updateBody: {
    id: string;
    email: string;
    dob: Date;
    consented: boolean;
    campaign: Campaign;
    firstName: string;
    gender: string;
    createdAt: Date;
  }) {
    return this.partialUpdate(updateBody);
  }

  static async partialUpdate(updateBody: {
    id: string;
    email?: string;
    dob?: Date;
    consented?: boolean;
    campaign?: Campaign;
    firstName?: string;
    gender?: string;
    createdAt?: Date;
  }) {
    const subscriptionRepository = getRepository(Subscription);
    const foundSubscription: Subscription = await subscriptionRepository.findOne(updateBody.id);

    if (!foundSubscription)
      throw new NotFound(`Subscription with primary key ${updateBody.id} not found`);
    if (updateBody.email !== undefined) foundSubscription.email = updateBody.email;
    if (updateBody.firstName !== undefined) foundSubscription.firstName = updateBody.firstName;
    if (updateBody.gender !== undefined) foundSubscription.gender = updateBody.gender;
    if (updateBody.dob !== undefined) foundSubscription.dob = updateBody.dob;
    if (updateBody.consented !== undefined) foundSubscription.consented = updateBody.consented;
    if (updateBody.createdAt !== undefined) foundSubscription.createdAt = updateBody.createdAt;
    if (updateBody.campaign !== undefined) foundSubscription.campaign = updateBody.campaign;
    await subscriptionRepository.save(foundSubscription);
    return foundSubscription;
  }

  static async destroy(id: string) {
    const subscriptionRepository = getRepository(Subscription);
    const foundSubscription = await subscriptionRepository.findOne(id);

    if (!foundSubscription) throw new NotFound(`Subscription with primary key ${id} not found`);

    await subscriptionRepository.delete(id);
    return foundSubscription;
  }
}
