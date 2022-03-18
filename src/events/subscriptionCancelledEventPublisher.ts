import { Publisher, Subjects, SubscriptionCancelledEvent } from '@adidastest-phillip/common';

/**
 * Sends out details of a cancelled subscription
 * */
export class SubscriptionCancelledEventPublisher extends Publisher<SubscriptionCancelledEvent> {
  readonly subject = Subjects.SubscriptionCancelled;
}
