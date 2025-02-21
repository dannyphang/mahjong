import { Component, Input } from '@angular/core';
import { RoomDto } from '../../../core/services/game.service';

@Component({
  selector: 'app-discard-area',
  templateUrl: './discard-area.component.html',
  styleUrl: './discard-area.component.scss'
})
export class DiscardAreaComponent {
  @Input() room: RoomDto;

}
