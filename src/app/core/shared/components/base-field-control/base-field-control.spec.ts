import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BaseFieldControlComponent } from './base-field-control';
import { Validators } from '@angular/forms';

describe('BaseFieldControlComponent', () => {
  let component: BaseFieldControlComponent;
  let fixture: ComponentFixture<BaseFieldControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BaseFieldControlComponent],
    });
    fixture = TestBed.createComponent(BaseFieldControlComponent as any);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`required has default value`, () => {
    expect(component.required).toEqual(false);
  });

  it(`disabled has default value`, () => {
    expect(component.disabled).toEqual(false);
  });

  it(`visibility has default value`, () => {
    expect(component.visibility).toEqual(`visible`);
  });

  it(`labelOneLine has default value`, () => {
    expect(component.labelOneLine).toEqual(false);
  });

  describe('checkRequiredField', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkRequiredField').and.callThrough();
      component.checkRequiredField();
      expect(component.checkRequiredField).toHaveBeenCalled();
    });

    it('must be true value when has validator', () => {
      component.fieldControl.validator = Validators.required;
      expect(component.checkRequiredField()).toBe(true);
    });

    it('must be false value when disabled', () => {
      component.disabled = true;
      expect(component.checkRequiredField()).toBe(false);
    });
  });

  describe('checkInvalidField', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkInvalidField').and.callThrough();
      component.checkInvalidField();
      expect(component.checkInvalidField).toHaveBeenCalled();
    });

    it('must be have errorMessage value when field invalid and errorMessageList not empty', () => {
      component.fieldControl.setErrors({ required: true });
      component.disabled = false;
      component.errorMessageList = {
        required: 'mock required',
      };
      component.fieldControl.markAllAsTouched();
      component.fieldControl.markAsDirty();
      component.checkInvalidField();
      expect(component.errorMessage).toEqual('mock required');
    });

    it('must be have errorMessage value when field invalid and errorMessageList empty', () => {
      component.fieldControl.setErrors(null);
      component.disabled = false;
      component.errorMessageList = {};
      component.fieldControl.markAllAsTouched();
      component.fieldControl.markAsDirty();
      component.checkInvalidField();
      expect(component.errorMessage).toEqual(undefined as any);
    });
  });
});
