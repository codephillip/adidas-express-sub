/* eslint import/no-cycle: "off" */
import { IsDate, IsIn, Length } from 'class-validator';
import {
  Entity,
  BaseEntity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { subscriptionGenderChoices } from '../../server/utils/constants/fieldChoices';
import Campaign from './campaign.model';

@Entity()
@Unique(['email'])
export default class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Length(0, 255)
  @Column()
  email: string;

  @Length(0, 255)
  @Column({ nullable: true, default: null })
  firstName: string;

  @IsIn(subscriptionGenderChoices)
  @Length(0, 255)
  @Column({ nullable: true, default: null })
  gender: string;

  @IsDate()
  @Column({ type: 'date' })
  dob: Date;

  @Column()
  consented: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Campaign, (campaign: Campaign) => campaign.subscriptions, {
    onDelete: 'CASCADE',
  })
  campaign: Campaign;

  @RelationId((subscription: Subscription) => subscription.campaign)
  campaignId: string;
}
