import {Injectable, signal, Signal, WritableSignal} from "@angular/core";
import {ToastMessage} from "../interfaces/toast-message.interface";
import {delay, of, take, timeout, timer} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public readonly messages: WritableSignal<ToastMessage[]> = signal<ToastMessage[]>([]);

  public pushMessage(message: ToastMessage['message'], type: ToastMessage['type'], persistent = false): void {
    const messages = this.messages();
    const toastMessage = {
      type,
      message,
      read: false,
    };

    this.messages.set([...messages, toastMessage]);

    if (!persistent) {
      of(toastMessage).pipe(delay(5000), take(1)).subscribe({
        next: (toastMessage) => this.markAsRead(toastMessage),
      })
    }

  }

  public addMessage(message: ToastMessage['message'], persistent = false): void {
    this.pushMessage(message, 'message', persistent);

  }

  public addError(message: ToastMessage['message'], persistent = true): void {
    this.pushMessage(message, 'error', persistent);
  }

  public addSuccess(message: ToastMessage['message'], persistent = false): void {
    this.pushMessage(message, 'success', persistent);
  }

  public markAsRead(markAsRead: ToastMessage): void {
    this.messages.update(messages => messages.map(message =>
      message === markAsRead ? {...message, read: true} : message
    ))
  }
}
