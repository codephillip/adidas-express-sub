import { Request, Response, NextFunction } from 'express';
import { CREATED } from 'http-status';
import { CampaignService } from 'server/services';
import { NotFound } from 'server/utils/errors';

export default class CampaignController {
  static async runServiceAction(req: Request, serviceAction: Function) {
    const { id } = req.params;
    const { name, createdAt } = req.body;
    if (id !== undefined) {
      return serviceAction({
        id,
        name,
        createdAt,
      });
    }
    return serviceAction({
      name,
      createdAt,
    });
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newCampaign = await CampaignController.runServiceAction(req, CampaignService.create);
      res.locals.status = CREATED;
      res.locals.data = newCampaign;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaignObject = await CampaignService.get(id);
      if (!campaignObject) {
        throw new NotFound(`Campaign with primary key ${id} not found`);
      }

      res.locals.data = campaignObject;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = { ...req.query };
      const allCampaigns = await CampaignService.getAll(filters);
      res.locals.data = allCampaigns;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCampaign = await CampaignController.runServiceAction(
        req,
        CampaignService.update,
      );
      res.locals.data = updatedCampaign;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async partialUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCampaign = await CampaignController.runServiceAction(
        req,
        CampaignService.partialUpdate,
      );
      res.locals.data = updatedCampaign;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaignDelete = await CampaignService.destroy(id);
      res.locals.data = campaignDelete;

      return next();
    } catch (error) {
      return next(error);
    }
  }
}
