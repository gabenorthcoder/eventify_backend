import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { UserEvent } from "./userEvent";
import { stubTrue } from "lodash";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({ type: "uuid", nullable: false })
  uuid: string;

  @Column("text")
  title: string;

  @Column("text")
  description: string;

  @Column({type: "text", nullable:true})
  address: string;
 
  @Column("timestamptz")
  date: Date;

  @Column({type: "text", nullable:true})
  imageUrl: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.createdEvents)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedEvents)
  updatedBy: User;

  @OneToMany(() => UserEvent, (userEvent) => userEvent.event)
  userEvents: UserEvent[]; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
