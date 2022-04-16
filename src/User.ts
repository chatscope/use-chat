import { UserId } from "./Types";
import { Presence } from "./Presence";

export type UserParams<UserData = any> = {
  readonly id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  presence?: Presence;
  data?: UserData;
};

export class User<UserData = any> {
  readonly id: UserId;
  presence: Presence = new Presence({});
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  data?: UserData;

  constructor({
    id,
    presence = new Presence({}),
    firstName = "",
    lastName = "",
    username = "",
    email = "",
    avatar = "",
    bio = "",
    data,
  }: UserParams) {
    this.id = id;
    this.presence = presence;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.bio = bio;
    this.data = data;
  }
}
