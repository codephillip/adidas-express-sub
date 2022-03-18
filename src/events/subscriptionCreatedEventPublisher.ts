import { Publisher, Subjects, SubscriptionCreatedEvent } from '@adidastest-phillip/common';

/**
 * Sends out details of a new subscription
 * */
export class SubscriptionCreatedEventPublisher extends Publisher<SubscriptionCreatedEvent> {
  readonly subject = Subjects.SubscriptionCreated;
}
