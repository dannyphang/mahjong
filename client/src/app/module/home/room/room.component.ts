import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from '../../../core/services/socketIo.service';
import { GameService, MahjongDto, PlayerDto, RoomDto } from '../../../core/services/game.service';
import { MessageService } from 'primeng/api';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent extends BaseCoreAbstract {
  roomId: string;
  role = 'operative';
  room: RoomDto;
  player: PlayerDto;

  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    protected override messageService: MessageService
  ) {
    super(messageService);

    if (this.socketIoService.currentPlayer) {
      this.initRoom();
    }
    else {
      this.router.navigate(["/"]);

    }
  }

  ngOnInit(): void {
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    if (this.player) {
      this.playerQuited(this.player);
      this.socketIoService.disconnectSocket();
    }
  }

  playerQuited(player: PlayerDto) {
    this.room.playerList = this.room.playerList.filter(p => p.playerId !== player.playerId);
    this.socketIoService.sendPlayerQuitRoom(this.room, player);
  }


  initRoom() {
    this.roomId = this.route.snapshot.paramMap.get('id') ?? 'undefined';
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
        gameStarted: roomU.gameStarted,
        roomOwnerId: roomU.roomOwnerId,
        gameOrder: roomU.gameOrder,
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
      this.room = room;
      this.popMessage(room.updateMessage, 'Info', 'info');
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

  drop(event: CdkDragDrop<MahjongDto[]>, mahjongList: MahjongDto[]) {
    moveItemInArray(mahjongList, event.previousIndex, event.currentIndex);
  }

  sortMahjongList(player: PlayerDto) {
    let newList: MahjongDto[] = player.mahjong.handTiles.mahjongTile;

    newList.sort((a, b) => a.order - b.order);

    this.room.playerList.find(p => p.playerId === player.playerId)!.mahjong.handTiles.mahjongTile = newList;
  }

  clickOtherPlayerTile() {
    this.popMessage("Don't touch other player's mahjong tile!!", 'Error', 'error');
  }

  selectedTileOutput(mahjong: MahjongDto, player: PlayerDto) {
    player.mahjong.handTiles.mahjongTile.forEach(m => {
      if (m.id !== mahjong.id) {
        m.isSelected = false;
      }
      else {
        m.isSelected = !m.isSelected;
      }
    });

    this.room.playerList.find(p => p.playerId === player.playerId)!.mahjong = player.mahjong;
  }

  anyButton() {
    this.room.gameOrder++
    if (this.room.gameOrder > 3) {
      this.room.gameOrder = 1;
    }
  }

  discardMahjong(player: PlayerDto) {
    if (player.mahjong.handTiles.mahjongTile.find(m => m.isSelected)) {
      this.socketIoService.sendDiscardMahjongTile(this.room, player, player.mahjong.handTiles.mahjongTile.find(m => m.isSelected)!)
    }
    else {
      this.popMessage("Please select a tile to discard.", 'Error', 'error');
    }
  }
}
