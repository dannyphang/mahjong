import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from '../../../core/services/socketIo.service';
import { GameService, PlayerDto, RoomDto } from '../../../core/services/game.service';
import { MessageService } from 'primeng/api';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent extends BaseCoreAbstract {
  roomId: string;
  role = 'operative';
  room: RoomDto = new RoomDto();
  player: PlayerDto = new PlayerDto();

  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    protected override messageService: MessageService
  ) {
    super(messageService);
  }

  ngOnInit(): void {
    if (this.socketIoService.currentPlayer) {
      this.initRoom();
    }
    else {
      this.router.navigate(["/"]);
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.playerQuited(this.player);
    this.socketIoService.disconnectSocket();

  }

  playerQuited(player: PlayerDto) {
    this.room.playerList = this.room.playerList.filter(p => p.playerId !== player.playerId);
    this.updateRoom(this.room);
  }


  initRoom() {
    this.roomId = this.route.snapshot.paramMap.get('id') ?? 'undeficed';
    this.player = this.socketIoService.currentPlayer;
    this.room = this.socketIoService.currentRoom;

    this.socketIoService.connect(this.roomId);

    this.recieveJoinedPlayers();
    this.recieveStartGame();
    this.recieveGameUpdate();

    this.socketIoService.playerJoinRoom(this.player, this.room);
  }

  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe(roomU => {
      this.popMessage(roomU.updateMessage, 'Info', 'info');

      let newRoom: RoomDto = {
        roomId: roomU.roomId,
        statusId: 1,
        playerList: roomU.playerList,
        gameStarted: roomU.gameStarted
      }

      this.socketIoService.currentRoom = newRoom;
      this.room = newRoom;
    });
  }

  recieveStartGame() {
    this.socketIoService.recieveStartGame().subscribe((room) => {
      this.room = room;
    });
  }

  recieveGameUpdate() {
    this.socketIoService.recieveRoomUpdate(this.roomId).subscribe((room) => {
      this.popMessage(room.updateMessage, 'Info', 'info');
      this.room = room;
    });
  }

  startGame() {
    this.socketIoService.startGame(this.room);
  }

  updateRoom(room: RoomDto) {
    room.playerList.forEach(p => {
      this.gameService.updatePlayer(p).subscribe(res => {
        if (res.isSuccess) {
        }
      });
    });

    this.socketIoService.sendRoomUpdate(room);
  }
}
