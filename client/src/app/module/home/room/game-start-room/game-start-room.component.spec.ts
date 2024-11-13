import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStartRoomComponent } from './game-start-room.component';

describe('GameStartRoomComponent', () => {
  let component: GameStartRoomComponent;
  let fixture: ComponentFixture<GameStartRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameStartRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameStartRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
