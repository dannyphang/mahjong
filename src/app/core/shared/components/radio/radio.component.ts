import { Component, Input } from '@angular/core';

import { BaseFieldDataSourceControl } from '../base-field-control/base-data-source-control';

@Component({
  selector: 'app-base-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class BaseRadioComponent extends BaseFieldDataSourceControl {
  @Input() override options!: { label?: any; value: any; preIcon?: string }[];
  @Input() direction: 'row' | 'column' = 'row';
  @Input() containerClass = '';
  @Input() inputContainerClass = '';
  @Input() labelClass = '';

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.disabled) {
      this.fieldControl.disable()
    }
  }
}
