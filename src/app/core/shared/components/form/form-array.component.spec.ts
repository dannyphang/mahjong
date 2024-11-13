import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, QueryList, ViewContainerRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { BaseFormArrayComponent } from './form-array.component';
import { FormArrayItemComponent } from './form-array-item.component';
import { FORM_ARRAY_TOKEN, CONTROL_TYPE } from './form.interface';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseLabelComponent } from '@d-components/label/label.component';
import { MockComponent } from 'ng-mocks';

describe('BaseFormArrayComponent', () => {
  let component: BaseFormArrayComponent;
  let fixture: ComponentFixture<BaseFormArrayComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    TestBed.overrideComponent(BaseFormArrayComponent, {
      set: {
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          ReactiveFormsModule,
          CommonModule,
          MockComponent(BaseLabelComponent),
        ],
        providers: [
          { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
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
    fixture = TestBed.createComponent(BaseFormArrayComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`fields has default value`, () => {
    expect(component.fields).toEqual([]);
  });

  it(`addBtnLabel has default value`, () => {
    expect(component.addBtnLabel).toEqual(`Add more`);
  });

  it(`removeBtnLabel has default value`, () => {
    expect(component.removeBtnLabel).toEqual(`Remove`);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.fieldControl = new FormArray([
        new FormGroup({
          arr: new FormControl(''),
        }),
      ]);
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngAfterViewInit').and.callThrough();
      component.container = new QueryList<ViewContainerRef>();
      const mockInstance = {
        instance: {
          formConfig: '',
          removeBtnLabel: '',
          addBtnLabel: '',
          addForm: of({}),
          removeForm: of({}),
        },
      };
      component.container.reset([
        ...component.container.toArray(),
        [
          {
            createComponent: (param: any) => mockInstance,
            clear: () => {},
          } as any,
        ],
      ]);
      component.fieldControl = new FormArray([
        new FormGroup({
          arr: new FormControl(''),
        }),
      ]);
      component.ngAfterViewInit();
      component.container.reset([
        ...component.container.toArray(),
        [
          {
            createComponent: (param: any) => mockInstance,
            clear: () => {},
          } as any,
        ],
      ]);
      expect(component.ngAfterViewInit).toHaveBeenCalled();
    });
  });

  it('getFieldsConfig makes expected calls', () => {
    spyOn(component, 'getFieldsConfig').and.callThrough();
    component.fieldConfigArr = [
      {
        a: '1',
      },
    ];
    const result = component.getFieldsConfig(0);
    expect(component.getFieldsConfig).toHaveBeenCalled();
    expect(result).toEqual({ a: '1' });
  });

  it('handleRemoveForm makes expected calls', () => {
    spyOn(component, 'handleRemoveForm').and.callThrough();
    component.fieldControl = new FormArray([
      new FormGroup({
        arr: new FormControl(''),
      }),
    ]);
    component.fieldConfigArr = [0];
    component.handleRemoveForm(0);
    expect(component.handleRemoveForm).toHaveBeenCalled();
  });

  it('handleAddForm makes expected calls', () => {
    spyOn(component, 'handleAddForm').and.callThrough();
    component.fieldControl = new FormArray([
      new FormGroup({
        arr: new FormControl(''),
      }),
    ]);
    component.fieldConfigArr = [0];
    component.handleAddForm(0);
    expect(component.handleAddForm).toHaveBeenCalled();
  });
});
