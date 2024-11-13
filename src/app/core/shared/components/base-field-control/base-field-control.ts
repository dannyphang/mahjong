import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: '', template: '' })
export abstract class BaseFieldControlComponent {
  private _errorMessageList: { [key: string]: string } = {
    required: 'ERROR.YOU_CANNOT_LEAVE_IT_BLANK',
    passwordConfirmNotSame: 'ERROR.PASSWORD_MUST_BE_SAME',
    invalidEmail: 'ERROR.INVALID_EMAIL',
    invalidPassword: 'ERROR.INVALID_PASSWORD',
    invalidUrl: 'ERROR.INVALID_URL',
  };
  @Input() id?: string;
  @Input() label = '';
  @Input() disabled: boolean = false;
  @Input() fieldControl = new FormControl();
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() visibility: string = 'visible';
  @Input() set errorMessageList(val: any) {
    this._errorMessageList = { ...this._errorMessageList, ...val };
  }

  get errorMessageList() {
    return this._errorMessageList;
  }

  @Input() labelOneLine = false;
  @Input() name = '';
  @Input() iconLabelTooltip: string | { key: string; param: object } = '';

  errorMessage!: string;

  checkRequiredField() {
    if (this.fieldControl.validator) {
      const validator = this.fieldControl.validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return this.required;
  }

  checkInvalidField() {
    const invalid =
      (this.fieldControl?.dirty || this.fieldControl.touched) &&
      this.fieldControl.invalid;
    if (invalid && !this.disabled) {
      this.errorMessage = !!this.errorMessageList
        ? this.errorMessageList[Object.keys(this.fieldControl.errors || [])[0]]
        : '';
    }
    return invalid;
  }

  checkDisabled() {
    return (
      this.disabled ||
      this.fieldControl.disabled ||
      this.fieldControl.parent?.disabled
    );
  }
}
