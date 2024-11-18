import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpToggleComponent } from './help-toggle.component';

describe('HelpToggleComponent', () => {
  let component: HelpToggleComponent;
  let fixture: ComponentFixture<HelpToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
