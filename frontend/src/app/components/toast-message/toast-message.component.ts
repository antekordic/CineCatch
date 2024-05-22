import {Component, computed, effect, HostBinding, HostListener, inject, input} from '@angular/core';
import {ToastComponent} from "../toast/toast.component";
import {ToastMessage} from "../../interfaces/toast-message.interface";

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.css'
})
export class ToastMessageComponent {
  private readonly toast = inject(ToastComponent, { optional: false });

  public message = input.required<ToastMessage>();

  @HostBinding('attr.toast-type') public toastTypeVal!: string;

  public toastType = effect(() => {
    this.toastTypeVal = this.message().type;
  });

  public toastMessage = computed(() => {
    return this.message().message;
  });

  @HostListener('click')
  public click() {
    this.toast.markAsRead(this.message());
  }
}
