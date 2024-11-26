import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-help-toggle',
  templateUrl: './help-toggle.component.html',
  styleUrl: './help-toggle.component.scss'
})
export class HelpToggleComponent {
  @Input() helpDialogVisible: boolean = false;
  @Output() dialogVisibleEmit: EventEmitter<boolean> = new EventEmitter();
  @Input() translateVisible: boolean = true;
  @Output() translateVisibleEmit: EventEmitter<boolean> = new EventEmitter();

  constructor() {

  }

  onHide() {
    this.helpDialogVisible = false;
    this.dialogVisibleEmit.emit(this.helpDialogVisible);
  }
}
