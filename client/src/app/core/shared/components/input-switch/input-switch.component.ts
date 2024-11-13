import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrl: './input-switch.component.scss'
})
export class InputSwitchComponent {
  @Output() switchUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldControl: FormControl = new FormControl(false);
  constructor() {

  }

  inputSwitchOnClick() {
    this.switchUpdate.emit();
  }
}
