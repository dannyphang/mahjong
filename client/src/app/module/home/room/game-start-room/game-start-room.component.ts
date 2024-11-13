import { Component, EventEmitter, Output } from '@angular/core';
import { RoomDto } from '../../../../core/services/game.service';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from '../../../../core/services/socketIo.service';

@Component({
  selector: 'app-game-start-room',
  templateUrl: './game-start-room.component.html',
  styleUrl: './game-start-room.component.scss'
})
export class GameStartRoomComponent {
  @Output() updateRoom: EventEmitter<RoomDto>;

  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

  }


}
