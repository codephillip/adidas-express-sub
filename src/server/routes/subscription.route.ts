import { Router } from 'express';
import { validate } from 'express-validation';
import { SubscriptionController } from 'server/controllers';
import { subscriptionValidation, options } from 'server/validations';

const subscriptionRouter = Router();

subscriptionRouter.get(
  '/',
  validate(subscriptionValidation.getAll, options),
  SubscriptionController.getAll,
);

subscriptionRouter.get('/:id', SubscriptionController.get);

subscriptionRouter.post(
  '/',
  validate(subscriptionValidation.create, options),
  SubscriptionController.create,
);

subscriptionRouter.put(
  '/:id',
  validate(subscriptionValidation.update, options),
  SubscriptionController.update,
);

subscriptionRouter.patch(
  '/:id',
  validate(subscriptionValidation.partialUpdate, options),
  SubscriptionController.partialUpdate,
);

subscriptionRouter.delete(
  '/:id',
  validate(subscriptionValidation.destroy, options),
  SubscriptionController.destroy,
);

export default subscriptionRouter;
