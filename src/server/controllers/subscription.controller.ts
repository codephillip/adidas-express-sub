import { Request, Response, NextFunction } from 'express';
import { CREATED } from 'http-status';
import { Campaign } from 'data/models';
import { SubscriptionService, CampaignService } from 'server/services';
import { NotFound } from 'server/utils/errors';
import { natsWrapper } from '@adidastest-phillip/common';
import { getAge } from 'server/utils/functions';
import { SubscriptionCreatedEventPublisher } from '../../events/subscriptionCreatedEventPublisher';
import { SubscriptionCancelledEventPublisher } from '../../events/subscriptionCancelledEventPublisher';

export default class SubscriptionController {
  static async runServiceAction(req: Request, serviceAction: Function) {
    const { id } = req.params;
    const { email, dob, consented, campaign, firstName, gender, createdAt } = req.body;

    let dbCampaign: Campaign;
    if (campaign !== null && typeof campaign !== 'undefined') {
      dbCampaign = await CampaignService.get(campaign);
      if (!dbCampaign) {
        throw new NotFound(`Campaign ${campaign} not found`);
      }
    }

    if (dob !== null && typeof dob !== 'undefined') {
      if (getAge(new Date(dob)) < 6 || getAge(new Date(dob)) > 130) {
        throw new NotFound('Access to minors is restricted');
      }
    }

    if (id !== undefined) {
      return serviceAction({
        id,
        email,
        dob,
        consented,
        campaign: dbCampaign,
        firstName,
        gender,
        createdAt,
      });
    }
    return serviceAction({
      email,
      dob,
      consented,
      campaign: dbCampaign,
      firstName,
      gender,
      createdAt,
    });
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newSubscription = await SubscriptionController.runServiceAction(
        req,
        SubscriptionService.create,
      );
      new SubscriptionCreatedEventPublisher(natsWrapper.client).publish({
        id: newSubscription.id,
        email: newSubscription.email,
        firstName: newSubscription.firstName,
        gender: newSubscription.gender,
        dob: newSubscription.dob,
        consented: newSubscription.consented,
        createdAt: newSubscription.createdAt,
      });
      res.locals.status = CREATED;
      res.locals.data = newSubscription;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const subscriptionObject = await SubscriptionService.get(id);
      if (!subscriptionObject) {
        throw new NotFound(`Subscription with primary key ${id} not found`);
      }

      res.locals.data = subscriptionObject;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = { ...req.query };
      const allSubscriptions = await SubscriptionService.getAll(filters);
      res.locals.data = allSubscriptions;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedSubscription = await SubscriptionController.runServiceAction(
        req,
        SubscriptionService.update,
      );
      res.locals.data = updatedSubscription;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async partialUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedSubscription = await SubscriptionController.runServiceAction(
        req,
        SubscriptionService.partialUpdate,
      );
      res.locals.data = updatedSubscription;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const subscriptionObject = await SubscriptionService.get(id);
      await new SubscriptionCancelledEventPublisher(natsWrapper.client).publish({
        id: subscriptionObject.id,
        email: subscriptionObject.email,
        firstName: subscriptionObject.firstName,
        gender: subscriptionObject.gender,
        dob: subscriptionObject.dob,
        consented: subscriptionObject.consented,
        createdAt: subscriptionObject.createdAt,
      });
      // To delete or flag it as cancelled needs clarification from the business analysts.
      // As it stands, I will delete it entirely
      res.locals.data = await SubscriptionService.destroy(id);
      return next();
    } catch (error) {
      return next(error);
    }
  }
}
