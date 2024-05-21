import {Component, computed, HostBinding, inject} from '@angular/core';
import {ToastService} from "../../services/toast.service";
import {ToastMessageComponent} from "../toast-message/toast-message.component";
import {ToastMessage} from "../../interfaces/toast-message.interface";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    ToastMessageComponent
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  public readonly messages = computed(() => this.toastService.messages().filter(message => !message.read));

  public markAsRead(message: ToastMessage): void {
    this.toastService.markAsRead(message);
  }
}
