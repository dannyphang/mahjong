import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardAreaComponent } from './discard-area.component';

describe('DiscardAreaComponent', () => {
  let component: DiscardAreaComponent;
  let fixture: ComponentFixture<DiscardAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscardAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscardAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
