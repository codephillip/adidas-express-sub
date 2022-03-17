import { Joi } from 'express-validation';

const campaignValidation = {
  getAll: {
    query: Joi.object({
      id: Joi.string().uuid({ version: ['uuidv4'] }),
      name: Joi.string().max(255),
      createdAt: Joi.date(),
    }),
  },
  create: {
    body: Joi.object({
      name: Joi.string().max(255),
      createdAt: Joi.date(),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
    body: Joi.object({
      name: Joi.string().max(255).required(),
      createdAt: Joi.date().required(),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
    body: Joi.object({
      name: Joi.string().max(255),
      createdAt: Joi.date(),
    }),
  },
  destroy: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
  },
};

export default campaignValidation;
