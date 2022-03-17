import { Joi } from 'express-validation';
import { subscriptionGenderChoices } from 'server/utils/constants/fieldChoices';

const subscriptionValidation = {
  getAll: {
    query: Joi.object({
      id: Joi.string().uuid({ version: ['uuidv4'] }),
      email: Joi.string().email(),
      firstName: Joi.string().max(255),
      gender: Joi.string()
        .valid(...subscriptionGenderChoices)
        .max(255),
      dob: Joi.date(),
      consented: Joi.boolean(),
      createdAt: Joi.date(),
    }),
  },
  create: {
    body: Joi.object({
      campaign: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
      email: Joi.string().email().required(),
      firstName: Joi.string().max(255),
      gender: Joi.string()
        .valid(...subscriptionGenderChoices)
        .max(255),
      dob: Joi.date().required(),
      consented: Joi.boolean().required(),
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
      email: Joi.string().email().required(),
      firstName: Joi.string().max(255).required(),
      gender: Joi.string()
        .valid(...subscriptionGenderChoices)
        .max(255)
        .required(),
      dob: Joi.date().required(),
      consented: Joi.boolean().required(),
      createdAt: Joi.date().required(),
      campaign: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
    body: Joi.object({
      email: Joi.string().email(),
      firstName: Joi.string().max(255),
      gender: Joi.string()
        .valid(...subscriptionGenderChoices)
        .max(255),
      dob: Joi.date(),
      consented: Joi.boolean(),
      createdAt: Joi.date(),
      campaign: Joi.string().uuid({ version: ['uuidv4'] }),
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

export default subscriptionValidation;
