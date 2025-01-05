import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  Unique,
} from "typeorm";
import { Event } from "./event";
import { UserEvent } from "./userEvent";

export enum UserRole {
  ADMIN = 0,
  STAFF = 1,
  USER = 2,
}

export enum UserAuthType {
  LOCAL = 1,
  GOOGLE = 2,
  FACEBOOK = 3,
}

@Entity()
@Unique(["email", "role"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({ type: "uuid", nullable: false })
  uuid: string;

  @Column({ type: "text", nullable: false })
  email: string;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: false })
  firstName: string;

  @Column({ type: "text", nullable: true })
  lastName: string;

  @Column({
    type: "enum",
    enum: UserRole,
    nullable: true,
  })
  role: UserRole;

  @Column({
    type: "enum",
    default: UserAuthType.LOCAL,
    enum: UserAuthType,
  })
  authType: UserAuthType;

  @ManyToOne(() => User)
  updatedBy: User;


  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents: Event[];


  @OneToMany(() => Event, (event) => event.updatedBy)
  updatedEvents: Event[];


  @OneToMany(() => UserEvent, (userEvent) => userEvent.user)
  userEvents: UserEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
