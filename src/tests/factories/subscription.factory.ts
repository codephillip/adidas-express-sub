import { date, datatype, random } from 'faker';
import { getRepository } from 'typeorm';
import { Subscription, Campaign } from 'data/models';
import { dateToUTC, getRandomValueFromArray } from 'server/utils/functions';
import { subscriptionGenderChoices } from '../../server/utils/constants/fieldChoices';
import { buildCampaign, createCampaign } from './campaign.factory';

interface SubscriptionRelations {
  campaign?: Campaign;
}

async function buildSubscription(subscription: SubscriptionRelations): Promise<Subscription> {
  const resSubscription = new Subscription();

  resSubscription.email = random.word().slice(0, 255) + "@example.com";
  resSubscription.firstName = random.word().slice(0, 255);
  resSubscription.gender = getRandomValueFromArray(subscriptionGenderChoices);
  resSubscription.dob = new Date(dateToUTC(date.past()).format('YYYY-MM-DD'));
  resSubscription.consented = datatype.boolean();
  resSubscription.createdAt = new Date(dateToUTC(date.past()).format('YYYY-MM-DDTHH:mm:ss[.000Z]'));

  resSubscription.campaign = subscription.campaign;

  if (subscription.campaign === null || typeof subscription.campaign === 'undefined') {
    const fakeCampaign = await buildCampaign({});
    const createdFakeCampaign = await createCampaign(fakeCampaign);
    resSubscription.campaign = createdFakeCampaign;
  }

  return Promise.resolve(resSubscription);
}

async function createSubscription(fakeSubscription: Subscription): Promise<Subscription> {
  const repository = getRepository(Subscription);
  const subscription = repository.create(fakeSubscription);
  await repository.save(subscription);

  return subscription;
}

export { buildSubscription, createSubscription };
