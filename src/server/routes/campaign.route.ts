import { Router } from 'express';
import { validate } from 'express-validation';
import { CampaignController } from 'server/controllers';
import { campaignValidation, options } from 'server/validations';

const campaignRouter = Router();

campaignRouter.get('/', validate(campaignValidation.getAll, options), CampaignController.getAll);

campaignRouter.get('/:id', CampaignController.get);

campaignRouter.post('/', validate(campaignValidation.create, options), CampaignController.create);

campaignRouter.put('/:id', validate(campaignValidation.update, options), CampaignController.update);

campaignRouter.patch(
  '/:id',
  validate(campaignValidation.partialUpdate, options),
  CampaignController.partialUpdate,
);

campaignRouter.delete(
  '/:id',
  validate(campaignValidation.destroy, options),
  CampaignController.destroy,
);

export default campaignRouter;
