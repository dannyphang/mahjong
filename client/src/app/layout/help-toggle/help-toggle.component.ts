import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-toggle',
  templateUrl: './help-toggle.component.html',
  styleUrl: './help-toggle.component.scss'
})
export class HelpToggleComponent {
  @Input() helpDialogVisible: boolean = false;

  constructor() {

  }


}
