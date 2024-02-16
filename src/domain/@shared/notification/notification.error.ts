import { NotificationErrorProps } from "./notification";

export default class NotificationError extends Error {
  code: number;
  constructor(public errors: NotificationErrorProps[],code: number) {
    super(
      errors.map((error) => `${error.context}: ${error.message}`).join(",")
    );
    this.code = code;
  }
}
