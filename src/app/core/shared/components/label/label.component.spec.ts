import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLabelComponent } from './label.component';

describe('LabelComponent', () => {
  let component: BaseLabelComponent;
  let fixture: ComponentFixture<BaseLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseLabelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaseLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
