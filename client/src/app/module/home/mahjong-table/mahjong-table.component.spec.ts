import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MahjongTableComponent } from './mahjong-table.component';

describe('MahjongTableComponent', () => {
  let component: MahjongTableComponent;
  let fixture: ComponentFixture<MahjongTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MahjongTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MahjongTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
