import { Permission } from "./Types";

export class ConversationRole {
  permissions: Array<Permission>;

  constructor(permissions: Array<Permission>) {
    this.permissions = permissions;
  }
}
