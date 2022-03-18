import AdminBro from 'admin-bro';
import { Subscription, Campaign } from 'data/models';
import { subscriptionGenderChoices } from '../utils/constants/fieldChoices';

const initializeAdminBroRoutes = () =>
  new AdminBro({
    rootPath: `/api/${process.env.API_VERSION}/subscriptionAdmin`,
    resources: [
      {
        resource: Subscription,
        options: {
          parent: {
            name: 'Database',
            icon: 'Api',
          },
          listProperties: ['id', 'email', 'firstName', 'gender', 'dob', 'consented', 'createdAt'],
          properties: {
            gender: {
              availableValues: subscriptionGenderChoices.map((gender) => ({
                value: gender,
                label: gender.toUpperCase(),
              })),
            },
          },
        },
      },
      {
        resource: Campaign,
        options: {
          parent: {
            name: 'Database',
            icon: 'Api',
          },
          listProperties: ['id', 'name', 'createdAt'],
        },
      },
    ],
    branding: {
      companyName: 'Database dashboard',
      softwareBrothers: false,
      logo: false,
    },
  });

export default initializeAdminBroRoutes;
