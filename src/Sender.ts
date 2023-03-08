import { SenderType } from "./enums/SenderType";

export interface SenderParams {
  id: string;
  type: SenderType;
}

export class Sender {
  readonly id: string;
  readonly type: SenderType;

  constructor({ id, type }: SenderParams) {
    this.id = id;
    this.type = type;
  }
}
