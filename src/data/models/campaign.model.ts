/* eslint import/no-cycle: "off" */
import { Length } from 'class-validator';
import { Entity, BaseEntity, Column, Unique, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Subscription from './subscription.model';

@Entity()
@Unique(['name'])
export default class Campaign extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Length(0, 255)
  @Column({ nullable: true, default: null })
  name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Subscription, (subscription: Subscription) => subscription.campaign)
  subscriptions: Subscription[];
}
