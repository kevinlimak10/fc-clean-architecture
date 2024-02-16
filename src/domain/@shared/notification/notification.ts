export type NotificationErrorProps = {
  message: string;
  context: string;
};

export default class Notification {
  private code: number;
  private errors: NotificationErrorProps[] = [];

  addError(error: NotificationErrorProps) {
    if(!this.code){
      this.code = 500;
    }
    this.errors.push(error);
  }

  addCode(code: number){
    this.code = code;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): NotificationErrorProps[] {
    return this.errors;
  }

  getCode(): number {
    return this.code;
  }

  messages(context?: string): string {
    let message = "";
    this.errors.forEach((error) => {
      if (context === undefined || error.context === context) {
        message += `${error.context}: ${error.message},`;
      }
    });
    return message;
  }
}
