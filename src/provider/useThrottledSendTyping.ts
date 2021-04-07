import { useMemo } from "react";
import { Subject, asyncScheduler } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { SendTypingServiceParams } from "../Types";
import { IChatService } from "../interfaces";

export const useThrottledSendTyping = (
  charService: IChatService,
  time: number
): ((params: SendTypingServiceParams) => void) =>
  useMemo(() => {
    const subject = new Subject<SendTypingServiceParams>();
    subject
      .pipe(
        throttleTime(time, asyncScheduler, { leading: true, trailing: true })
      )
      .subscribe((params) => {
        charService.sendTyping(params);
      });

    return (params: SendTypingServiceParams): void => subject.next(params);
  }, [time]);
