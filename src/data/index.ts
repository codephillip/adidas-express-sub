import { Database, Resource } from '@admin-bro/typeorm';
import { validate } from 'class-validator';
import AdminBro from 'admin-bro';
import ORMDatabase from 'data/database';
import { Subscription, Campaign } from 'data/models';

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

export async function setUpDatabase() {
  const db = new ORMDatabase();

  await db.startDatabase();

  Subscription.useConnection(db.getConnection());
  Campaign.useConnection(db.getConnection());
}
