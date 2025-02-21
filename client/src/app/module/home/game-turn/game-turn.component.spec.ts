import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTurnComponent } from './game-turn.component';

describe('GameTurnComponent', () => {
  let component: GameTurnComponent;
  let fixture: ComponentFixture<GameTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameTurnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
