import { UserId } from "./Types";
import { Presence } from "./Presence";

export type UserParams = {
  readonly id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  presence: Presence;
};

export class User {
  readonly id: UserId;
  presence: Presence = new Presence({});
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;

  constructor({
    id,
    presence = new Presence({}),
    firstName = "",
    lastName = "",
    username = "",
    email = "",
    avatar = "",
    bio = "",
  }: UserParams) {
    this.id = id;
    this.presence = presence;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.bio = bio;
  }
}
