import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { FormItemComponent } from './form-item.component';
import { FormArrayItemComponent } from './form-array-item.component';
import { BaseFormArrayComponent } from './form-array.component';
import {
  BASE_UI_TOKEN,
  FORM_ARRAY_TOKEN,
  CONTROL_TYPE,
  FormConfig,
} from './form.interface';
import { allBaseUIForm } from 'app/inject-value';
import { FormControl } from '@angular/forms';

describe('FormItemComponent', () => {
  let component: FormItemComponent;
  let fixture: ComponentFixture<FormItemComponent>;

  beforeEach(() => {
    TestBed.overrideComponent(FormItemComponent, {
      set: {
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: BASE_UI_TOKEN,
            useValue: allBaseUIForm,
          },
          {
            provide: FORM_ARRAY_TOKEN,
            useValue: {
              [CONTROL_TYPE.FormArray]: BaseFormArrayComponent,
              arrayItem: FormArrayItemComponent,
            },
          },
        ],
      },
    });
    fixture = TestBed.createComponent(FormItemComponent);
    component = fixture.componentInstance;
    component.parentFieldConfig = [
      {
        id: 'testField',
        type: CONTROL_TYPE.Textbox,
        fieldControl: new FormControl(''),
      } as FormConfig,
    ];
    component.fieldConfig = {
      type: CONTROL_TYPE.Dropdown,
      layoutDefine: { row: 0, column: 0 },
      options: [],
      dependOnFields: [{ fields: ['testField'], action: () => of([]) }],
    } as FormConfig;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('makes expected calls', () => {
    component.fieldConfig = {
      type: CONTROL_TYPE.Dropdown,
      layoutDefine: { row: 0, column: 0 },
      options: [],
      dependOnFields: [
        {
          updateOptions: true,
          debounce: 1,
          fields: ['testField'],
          action: () => of([]),
        },
      ],
    } as FormConfig;
    spyOn(component.formItemContainer, 'createComponent').and.callThrough();
    component.ngOnInit();
    expect(component.formItemContainer.createComponent).toHaveBeenCalled();
  });
});
