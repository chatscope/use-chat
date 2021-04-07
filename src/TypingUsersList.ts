import { TypingUser } from "./TypingUser";
import { UserId } from "./Types";

interface TypingUsersListParams {
  items: Array<TypingUser>;
}

/**
 * List of typing users
 */
export class TypingUsersList {
  items: Array<TypingUser>;

  constructor({ items }: TypingUsersListParams) {
    this.items = items;
  }

  get length(): number {
    return this.items.length;
  }

  findIndex(userId: UserId): number {
    return this.items.findIndex((u) => u.userId === userId);
  }

  /**
   * Ads typing user to collection.
   * If user with this id already exists it will be replaced
   * @param typingUser
   */
  addUser(typingUser: TypingUser): void {
    const idx = this.findIndex(typingUser.userId);

    if (idx !== -1) {
      this.items = this.items
        .slice(0, idx)
        .concat(typingUser)
        .concat(this.items.slice(idx + 1));
    } else {
      this.items = this.items.concat(typingUser);
    }
  }

  /**
   * Remove user with specified id from collection
   * @param userId
   */
  removeUser(userId: UserId): void {
    const idx = this.findIndex(userId);

    if (idx !== -1) {
      this.items = this.items.slice(0, idx).concat(this.items.slice(idx + 1));
    }
  }
}
