import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseFieldDataSourceControl } from '../base-field-control/base-data-source-control';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-base-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class BaseCheckboxComponent
  extends BaseFieldDataSourceControl
  implements OnInit {
  @Input() override options: { label: any; value: any; required?: boolean; disabled?: boolean }[] = [];
  @Input() direction: 'row' | 'column' = 'row';
  @Input() optionsContainerClass = '';
  @Input() singleSelect = false;
  @Input() override dataSourceAction: (() => Observable<any>) | null = null;
  @Input() switchInput = false;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  constructor() {
    super();
  }

  selected: (string | number)[] = [];

  override ngOnInit(): void {
    super.ngOnInit();

    this.options = this.options.map((i) =>
      typeof i.value === 'boolean' ? { ...i, value: i.value.toString() } : i,
    );

    this.optionUpdated.pipe(takeUntil(this.destroy$)).subscribe((_) => {
      this.options = this.options.map((i) =>
        typeof i.value === 'boolean' ? { ...i, value: i.value.toString() } : i,
      );
    });

    this.fieldControl.valueChanges.subscribe((val) => {
      if (Array.isArray(this.fieldControl.value))
        this.selected = this.convertBooleanToStringValue(
          this.fieldControl.value,
        );
      else {
        if (this.fieldControl.value)
          this.selected = this.selected.concat(
            typeof this.fieldControl.value === 'boolean'
              ? this.fieldControl.value.toString()
              : this.fieldControl.value,
          );
      }
    });

    if (Array.isArray(this.fieldControl.value))
      this.selected = this.convertBooleanToStringValue(this.fieldControl.value);
    else {
      if (this.fieldControl.value)
        this.selected = this.selected.concat(
          typeof this.fieldControl.value === 'boolean'
            ? this.fieldControl.value.toString()
            : this.fieldControl.value,
        );
    }

    this.fieldControl.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val === 'DISABLED') {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      });
  }

  handleChange(event: any, value: any) {
    if (this.singleSelect) {
      if (!event.checked.includes(value)) {
        this.selected = [];
      } else {
        this.selected = [value];
      }
    }
    this.fieldControl.setValue(
      this.selected.map((i) =>
        i === 'true' ? true : i === 'false' ? false : i,
      ),
    );
    this.onChange.emit(event);
  }

  private convertBooleanToStringValue(data: (number | boolean | string)[]) {
    return data.map((i) => (typeof i === 'boolean' ? i.toString() : i));
  }
}
