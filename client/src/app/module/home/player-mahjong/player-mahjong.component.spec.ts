import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMahjongComponent } from './player-mahjong.component';

describe('PlayerMahjongComponent', () => {
  let component: PlayerMahjongComponent;
  let fixture: ComponentFixture<PlayerMahjongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerMahjongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerMahjongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
