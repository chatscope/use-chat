import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { ConversationId, UserId } from "../Types";
import { IStorage } from "../interfaces";
import { useCallback, useRef } from "react";

interface UseDebounceTypingParams {
  conversationId: ConversationId;
  userId: UserId;
}

export const useDebounceTyping = (
  duration: number,
  updateState: () => void,
  storage: IStorage
): ((conversationId: ConversationId, userId: UserId) => void) => {
  const debouncers = useRef<
    Map<ConversationId, Map<UserId, Subject<UseDebounceTypingParams>>>
  >(new Map());

  const createDebouncer = useCallback(() => {
    const subject = new Subject<UseDebounceTypingParams>();
    subject
      .pipe(debounceTime(duration))
      .subscribe(({ conversationId, userId }) => {
        // Stop subject
        subject.complete();

        // Remove debouncer from collection
        const deb = debouncers.current;
        const conversationItem = deb.get(conversationId);

        if (conversationItem) {
          conversationItem.delete(userId);
          // Cleanup. Remove conversation if it doesn't contain any users
          if (conversationItem.size === 0) {
            deb.delete(conversationId);
          }
        }

        // Remove typing user from conversation
        const [conversation] = storage.getConversation(conversationId);
        if (conversation) {
          conversation.removeTypingUser(userId);
          updateState();
        }
      });

    return subject;
  }, [debouncers, duration, updateState, storage]);

  return (conversationId: ConversationId, userId: UserId) => {
    const deb = debouncers.current;

    const conversationItem = deb.get(conversationId);

    if (conversationItem) {
      // Conversation exists - searching for user

      const userItem = conversationItem.get(userId);

      if (userItem) {
        // User found - debounce

        userItem.next({ conversationId, userId });
      } else {
        // User not found - create a debouncer

        const subject = createDebouncer();

        conversationItem.set(userId, subject);
      }
    } else {
      // Conversation not found - create new and a deboucer

      const subject = createDebouncer();

      const newEntry = new Map();
      newEntry.set(userId, subject);
      deb.set(conversationId, newEntry);
      subject.next({ conversationId, userId });
    }
  };
};
