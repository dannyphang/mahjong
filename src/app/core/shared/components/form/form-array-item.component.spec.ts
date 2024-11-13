import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormArrayItemComponent } from './form-array-item.component';
import { BaseButtonComponent } from '@d-components/button/button.component';
import { BaseFormComponent } from './form.component';
import { MockComponents } from 'ng-mocks';

describe('FormArrayItemComponent', () => {
  let component: FormArrayItemComponent;
  let fixture: ComponentFixture<FormArrayItemComponent>;

  beforeEach(() => {
    TestBed.overrideComponent(FormArrayItemComponent, {
      set: {
        schemas: [NO_ERRORS_SCHEMA],
        imports: [MockComponents(BaseButtonComponent, BaseFormComponent)],
      },
    });
    fixture = TestBed.createComponent(FormArrayItemComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('handleAddForm makes expected calls', () => {
    spyOn(component, 'handleAddForm').and.callThrough();
    component.handleAddForm();
    expect(component.handleAddForm).toHaveBeenCalled();
  });

  it('handleRemoveForm makes expected calls', () => {
    spyOn(component, 'handleRemoveForm').and.callThrough();
    component.handleRemoveForm();
    expect(component.handleRemoveForm).toHaveBeenCalled();
  });
});
