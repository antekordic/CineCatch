import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, RadioControlValueAccessor} from "@angular/forms";

@Component({
  selector: 'app-rating-control',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingControlComponent),
      multi: true,
    }
  ],
  templateUrl: './rating-control.component.html',
  styleUrl: './rating-control.component.css'
})
export class RatingControlComponent implements ControlValueAccessor {
  @Input() options: { label: string, value: any }[] = [];

  public readonly uuid = crypto.randomUUID();
  public readonly stdValues: number[] = [5,4,3,2,1];
  public value: number | null = null;

  public onChange = (value: any) => {};
  public onTouched = () => {};

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {}

  public handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.writeValue(value);
    this.onChange(value);
    this.onTouched();
  }
}
