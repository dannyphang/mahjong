import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MahjongSetComponent } from './mahjong-set.component';

describe('MahjongSetComponent', () => {
  let component: MahjongSetComponent;
  let fixture: ComponentFixture<MahjongSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MahjongSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MahjongSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
