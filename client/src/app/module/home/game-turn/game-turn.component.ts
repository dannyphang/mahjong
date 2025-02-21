import { Component, Input } from '@angular/core';
import { PlayerDto, RoomDto } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-turn',
  templateUrl: './game-turn.component.html',
  styleUrl: './game-turn.component.scss'
})
export class GameTurnComponent {
  @Input() room: RoomDto;
  @Input() player: PlayerDto;

  constructor() {

  }

  returnPlayerDirectionLabel(increaseNumber: number): number {
    let num = this.player?.direction + increaseNumber;

    if (num > 3) {
      num -= 3;
    }

    return num;
  }
}
