import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BaseFieldControlComponent } from '../base-field-control/base-field-control';

// to disable warnings then we have a config in angular.json allowedCommonJsDependencies
import dayjs from 'dayjs';
import { CalendarTypeView } from 'primeng/calendar';
import { combineLatest, startWith, Subject, takeUntil } from 'rxjs';
import { DEFAULT_FORMAT_DATE } from '../../constants/common.constants';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-base-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BaseDatepickerComponent
  extends BaseFieldControlComponent
  implements OnInit, OnChanges {
  @Input() dateFormat!: string;
  @Input() mode: 'range' | 'single' | 'range_2' = 'single';
  @Input() override placeholder: string = DEFAULT_FORMAT_DATE;
  @Input() minDate!: Date;
  @Input() maxDate!: Date;
  @Input() view?: CalendarTypeView = 'date';
  @Input() showTime: boolean = false;
  @Input() timeOnly: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  date_from = new FormControl();
  date_to = new FormControl();
  dateToErrorMessage = '';
  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.mode === 'range_2') {
      const _this = this;

      const func = FormControl.prototype.markAsTouched;

      FormControl.prototype.markAsTouched = function () {
        func.call(this);
        if (Array.isArray(this.value)) {
          _this.date_from = new FormControl(_this.date_from.value);
          _this.date_to = new FormControl(_this.date_to.value);
          _this.date_from.markAsTouched();
          _this.date_to.markAsTouched();
        }
      };

      this.fieldControl.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((status) => {
          if (status === 'DISABLED') {
            this.setDisabledRange(true);
          }
        });

      this.date_from.updateValueAndValidity();
      this.date_to.updateValueAndValidity();
      if (typeof this.fieldControl.value === 'string') {
        this.fieldControl = new FormControl();
        this.date_from = new FormControl(new Date());
        this.date_from.markAsTouched();
      } else {
        if (this.fieldControl.value) {
          if (
            (this.fieldControl.value[0] === '' &&
              this.fieldControl.value[1] === '') ||
            (this.fieldControl.value[0] === null &&
              this.fieldControl.value[1] === null)
          ) {
            this.date_from.reset(null, { emitEvent: false });
            this.date_to.reset(null, { emitEvent: false });
          } else {
            this.date_from = new FormControl(
              this.fieldControl.value &&
                this.fieldControl.value[0] instanceof Date
                ? this.fieldControl.value[0]
                : new Date(this.fieldControl.value?.[0]),
            );
            this.date_to = new FormControl(
              this.fieldControl.value &&
                this.fieldControl.value[1] instanceof Date
                ? this.fieldControl.value[1]
                : new Date(this.fieldControl.value?.[1]),
            );
          }
        }
      }

      combineLatest([
        this.date_from.valueChanges.pipe(startWith(this.date_from.value)),
        this.date_to.valueChanges.pipe(startWith(this.date_to.value)),
      ]).subscribe(([from, to]) => {
        if (from && to && dayjs(to).isBefore(dayjs(from))) {
          this.date_from.setErrors({ invalid_range: true });
          this.date_to.setErrors({ invalid_range: true });
          this.fieldControl.setErrors({ invalid_range: true });
        }

        if (
          from &&
          to &&
          !dayjs(to).isBefore(dayjs(from)) &&
          (this.date_from.hasError('invalid_range') ||
            this.date_to.hasError('invalid_range'))
        ) {
          this.date_from.setErrors({ invalid_range: null });
          this.date_to.setErrors({ invalid_range: null });
          this.date_from.updateValueAndValidity();
          this.date_to.updateValueAndValidity();
        }
      });

      this.fieldControl.valueChanges.subscribe((val) => {
        if (
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.every((e) => e === null || e === ''))
        ) {
          if (this.mode === 'range_2') {
            this.date_from.reset();
            this.date_to.reset();
          } else {
            this.date_from.reset();
          }
        } else {
          if (val[0] !== this.date_from.value) {
            this.date_from = new FormControl(
              val[0] instanceof Date ? val[0] : new Date(val[0]),
            );
            this.date_from.markAsTouched();
          }

          if (val[1] !== this.date_to.value) {
            this.date_to = new FormControl(
              val[0] instanceof Date ? val[1] : new Date(val[1]),
            );
            this.date_to.markAsTouched();
          }
        }
      });

      this.setDisabledRange(this.disabled);
    } else {
      // this.fieldControl.addValidators(this.invalidDateFormat(this.dateFormat));
      let validators = [this.invalidDateFormat(this.dateFormat)];
      if (this.required) {
        validators = [Validators.required, ...validators];
      }
      this.fieldControl.addValidators(validators);
      this.fieldControl.updateValueAndValidity();
    }

    this.date_from.addValidators(this.invalidDateFormat(this.dateFormat));
    this.date_to.addValidators(this.invalidDateFormat(this.dateFormat));

    if (this.fieldControl.hasValidator(Validators.required)) {
      this.fieldControl.removeValidators(Validators.required);
      this.fieldControl.addValidators(this.customRequiredValidatorRange2);
      this.date_from.addValidators(Validators.required);
      this.date_to.addValidators(Validators.required);
    }

    this.errorMessageList = {
      format: 'ERROR.INVALID_FORMAT',
      invalid_range: 'ERROR.INVALID_DATE_RANGE',
      ...this.errorMessageList,
    };

    if (this.disabled) {
      this.fieldControl.disable()
    }
  }

  ngOnChanges(changes: any): void {
    if (this.mode === 'range_2' && changes.disabled) {
      this.setDisabledRange(changes.disabled.currentValue);
    }
  }

  setDisabledRange(disabled: boolean) {
    if (disabled) {
      this.date_from.disable();
      this.date_to.disable();
    } else {
      this.date_from.enable();
      this.date_to.enable();
    }
  }

  invalidDateFormat(format: string = DEFAULT_FORMAT_DATE): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value === 'string') {
        return !control.value || dayjs(control.value, format).isValid()
          ? null
          : { format: true };
      } else {
        return !control.value || dayjs(control.value).isValid()
          ? null
          : { format: true };
      }
    };
  }

  override checkInvalidField(): boolean {
    if (this.mode !== 'range_2') return super.checkInvalidField();
    const invalid =
      (this.date_from?.dirty || this.date_from?.touched) &&
      this.date_from?.invalid;
    if (invalid && !this.disabled) {
      this.errorMessage = !!this.errorMessageList
        ? this.errorMessageList[Object.keys(this.date_from.errors || [])[0]]
        : '';
    }
    return invalid;
  }

  checkInvalidDateToField(): boolean {
    const invalid =
      (this.date_to?.dirty || this.date_to?.touched) && this.date_to?.invalid;
    if (invalid && !this.disabled) {
      this.errorMessage = !!this.errorMessageList
        ? this.errorMessageList[Object.keys(this.date_to.errors || [])[0]]
        : '';
      // not show invalid_range error message in date_to
      this.dateToErrorMessage = !!this.errorMessageList
        ? this.errorMessageList[
        Object.keys(this.date_to.errors || []).filter(
          (e) => e !== 'invalid_range',
        )[0]
        ]
        : '';
    }
    return invalid;
  }

  customRequiredValidatorRange2 = (control: AbstractControl) => {
    if (!control.value || (!control.value[0] && !control.value[1]))
      return { required: true };
    return null;
  };

  IsArrayLabel(label: any) {
    return Array.isArray(label) && label.length > 1;
  }
}
