import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";

@Entity()
export class UserEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Event, (event) => event.userEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "eventId" })
  event: Event;
}
