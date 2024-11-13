import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BaseFieldDataSourceControl } from './base-data-source-control';
import { of } from 'rxjs';
import { CONTROL_TYPE, FormConfig } from '../form/form.interface';
import { FormControl } from '@angular/forms';

describe('BaseFieldDataSourceControl', () => {
  let component: BaseFieldDataSourceControl;
  let fixture: ComponentFixture<BaseFieldDataSourceControl>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BaseFieldDataSourceControl],
    });
    fixture = TestBed.createComponent(BaseFieldDataSourceControl as any);
    component = fixture.componentInstance;
    component.parentFieldConfig = [
      {
        id: 'testFields',
        type: CONTROL_TYPE.Textbox,
        fieldControl: new FormControl(''),
      } as FormConfig,
    ];
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('should load instance data source', () => {
    component.dataSourceAction = () => of([]);
    component.ngOnInit();
    expect(component['currentEvent'].eventType).toEqual('initData');
  });

  it('should load data source by dependOnFields', () => {
    component.dependOnFields = [
      {
        fields: ['testFields'],
        updateOptions: true,
        action: () => of([]),
      },
    ];
    component.ngOnInit();
    expect(component['trackingField'].length).toEqual(1);
  });

  it('should load data source by dataSourceDependOn', () => {
    component.dataSourceDependOn = ['testFields'];
    component.ngOnInit();
    expect(component['trackingField'].length).toEqual(1);
  });

  it('should load data source by dataSourceDependOn with dataSourceAction', () => {
    component.dependOnFields = [
      {
        fields: ['testFields'],
        updateOptions: false,
        action: () => of([]),
      },
    ];
    component.dataSourceDependOn = ['testFields'];
    component.dataSourceAction = () =>
      of([{ label: 'Test', value: 'test first' }]);
    component.ngOnInit();
    expect(component['trackingField'].length).toEqual(1);
  });

  it('should load data source by dataSourceDependOn with dataSourceAction and sort data', () => {
    component.sortOption = true;
    component.virtualScroll = true;
    component.dataSourceDependOn = ['testFields'];
    component.dataSourceAction = () =>
      of({
        options: [
          { label: 'Test 1', value: 'test 1' },
          { label: 'Test 2', value: 'test 2' },
          { label: 'Test 2', value: 'test 3' },
          { label: 'Test 0', value: 'test 0' },
        ],
        totalRecords: 4,
      });
    component.ngOnInit();
    expect(component['trackingField'].length).toEqual(1);
  });
});
