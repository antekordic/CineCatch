import {Injectable, signal, Signal, WritableSignal} from "@angular/core";
import {ToastMessage} from "../interfaces/toast-message.interface";

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public readonly messages: WritableSignal<ToastMessage[]> = signal<ToastMessage[]>([]);

  public pushMessage(message: ToastMessage['message'], type: ToastMessage['type']): void {
    const messages = this.messages();

    this.messages.set([...messages, {
      type,
      message,
      read: false,
    }]);
  }

  public addMessage(message: ToastMessage['message']): void {
    this.pushMessage(message, 'message');
  }

  public addError(message: ToastMessage['message']): void {
    this.pushMessage(message, 'error');
  }

  public addSuccess(message: ToastMessage['message']): void {
    this.pushMessage(message, 'success');
  }

  public markAsRead(markAsRead: ToastMessage): void {
    this.messages.update(messages => messages.map(message =>
      message === markAsRead ? {...message, read: true} : message
    ))
  }
}
