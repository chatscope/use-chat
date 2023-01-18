import { useRef } from "react";
import type { MutableRefObject } from "react";
import type { ChatServiceFactory, UpdateState } from "../Types";
import type { IChatService, IStorage } from "../interfaces";

export function useLazyServiceFactoryRef<S extends IChatService>(
  serviceFactory: ChatServiceFactory<S>,
  storage: IStorage,
  update: UpdateState
) {
  const ref = useRef<S>();

  if (typeof ref.current === "undefined") {
    ref.current = serviceFactory(storage, update);
  }

  return ref as MutableRefObject<S>;
}
