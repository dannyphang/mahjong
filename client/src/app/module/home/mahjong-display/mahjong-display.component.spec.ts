import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MahjongDisplayComponent } from './mahjong-display.component';

describe('MahjongDisplayComponent', () => {
  let component: MahjongDisplayComponent;
  let fixture: ComponentFixture<MahjongDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MahjongDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MahjongDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
