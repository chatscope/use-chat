import { UserStatus } from "./enums/UserStatus";

export type PresenceParams = {
  status?: UserStatus;
  description?: string;
};

export class Presence {
  status: UserStatus = UserStatus.Unknown;
  description = "";

  constructor({
    status = UserStatus.Unknown,
    description = "",
  }: PresenceParams) {
    this.status = status;
    this.description = description;
  }
}
