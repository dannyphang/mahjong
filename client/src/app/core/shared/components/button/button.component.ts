import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SplitButton, SplitButtonModule } from 'primeng/splitbutton';
import { BaseFieldControlComponent } from '../base-field-control/base-field-control';

@Component({
  selector: 'app-base-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class BaseButtonComponent
  extends BaseFieldControlComponent
  implements OnInit {
  @Input() outlined!: boolean;
  @Input() color: 'normal' | 'red' | 'yellow' | 'green' = 'normal';
  @Input() iconUrl!: string;
  @Input() rightIcon: boolean = false;
  @Input() iconName: string = '';
  @Input() type: 'normal' | 'split' = 'normal';
  @Input() buttonType: 'button' | 'submit' = 'button';
  @Input() splitButtonItems: {
    label: string;
    icon?: string;
    command?: () => void;
  }[] = [];
  @Input() splitOneClick = false;
  @Output() onClick = new EventEmitter();
  @Input() actionType?: string | string[];
  @Input() createdBy?: string;
  @Input() moduleCode?: any;
  @Input() buttonClass: string;
  constructor() {
    super();
  }

  actionPermission: {
    moduleCode: string | string[];
    actionType: string | string[];
  };

  ngOnInit(): void {
    if (this.type === 'split' && this.splitOneClick) {
      SplitButton.prototype.onDefaultButtonClick =
        SplitButton.prototype.onDropdownButtonClick;
    }

    if (this.actionPermission) {
      this.moduleCode = this.actionPermission.moduleCode;
      this.actionType = this.actionPermission.actionType;
    }
  }

  click($event: MouseEvent) {
    this.onClick.emit($event);
  }
}
