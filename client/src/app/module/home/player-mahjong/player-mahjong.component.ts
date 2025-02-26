import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { MahjongDto, GameService, RoomDto, PlayerDto } from '../../../core/services/game.service';
import { SocketioService } from '../../../core/services/socketIo.service';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';

@Component({
  selector: 'app-player-mahjong',
  templateUrl: './player-mahjong.component.html',
  styleUrl: './player-mahjong.component.scss'
})
export class PlayerMahjongComponent extends BaseCoreAbstract {
  @Input() room: RoomDto;
  @Input() player: PlayerDto;
  @Input() currentPlayer: boolean = false;
  @Input() playerPosition: 'prev' | 'next' | 'current' = 'current';

  chowVisible: boolean;
  selectedChowList: MahjongDto[] = [];

  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    protected override messageService: MessageService,
    private translateService: TranslateService
  ) {
    super(messageService);
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
    this.popMessage("Don't touch other player's mahjong tile!!", 'error');
  }

  selectedTileOutput(mahjong: MahjongDto, player: PlayerDto) {
    player.mahjong.handTiles.mahjongTile.forEach(m => {
      if (m.id !== mahjong.id) {
        m.isSelected = false;
      }
    });

    this.room.playerList.find(p => p.playerId === player.playerId)!.mahjong = player.mahjong;
  }

  selectedTileOutput2(mahjong: MahjongDto, player: PlayerDto) {
    player.mahjong.handTiles.mahjongTile.forEach(m => {
      if (m.id === mahjong.id) {
        m = mahjong;
      }
      if (m.isSelected && !this.selectedChowList.find(mah => mah.id === m.id)) {
        this.selectedChowList.push(m);
      }
    });

    this.room.playerList.find(p => p.playerId === player.playerId)!.mahjong = player.mahjong;
  }

  anyButton() {
    this.nextTurn();
  }

  discardMahjong(player: PlayerDto) {
    if (player.mahjong.handTiles.mahjongTile.find(m => m.isSelected)) {
      this.socketIoService.sendDiscardMahjongTile(this.room, player, player.mahjong.handTiles.mahjongTile.find(m => m.isSelected)!)
    }
    else {
      this.popMessage(this.translateService.instant("ACTION.MESSAGE.SELECTE_TILE_DISCARD"), 'error');
    }
  }

  checkIsTileSelected(player: PlayerDto) {
    return !player.mahjong.handTiles.mahjongTile.find(m => m.isSelected);
  }

  checkIsTileFullNow(player: PlayerDto) {
    return (player.mahjong.handTiles.mahjongTile.length - 2) % 3 === 0;
  }

  drawMahjong(player: PlayerDto) {
    this.socketIoService.sendDrawMahjong(this.room, player);
  }

  nextTurn() {
    this.socketIoService.sendNextTurn(this.room);
  }

  actionMahjong(action: string, player: PlayerDto) {
    switch (action) {
      case 'pong':
        this.socketIoService.sendMahjongAction('pong', this.room, player, this.room.mahjong.discardTiles[this.room.mahjong.discardTiles.length - 1]);
        break;
      case 'chow':
        this.player.mahjong.handTiles.mahjongTile.forEach(m => {
          m.isSelected = false;
        });
        this.selectedChowList = [];
        this.chowVisible = true;
        break;
      case 'kong':
        this.socketIoService.sendMahjongAction('kong', this.room, player, this.room.mahjong.discardTiles[this.room.mahjong.discardTiles.length - 1]);
        break;
      case 'self-kong':
        let selectedMahjong = this.room.playerList.find(p => p.playerId === this.player.playerId)?.mahjong.handTiles.mahjongTile.find(m => m.isSelected);

        if (!selectedMahjong) {
          this.popMessage(this.translateService.instant("ACTION.MESSAGE.SELECTE_TILE_KONG"), 'error');
        }
        else {
          this.socketIoService.sendMahjongAction('self-kong', this.room, player, selectedMahjong);
        }
        break;
      case 'win':
        this.checkPoint(player)
        break;
      case 'cancel':
        this.socketIoService.sendMahjongAction('cancel', this.room, player, this.room.mahjong.discardTiles[this.room.mahjong.discardTiles.length - 1]);
        break;

    }
  }

  checkPoint(player: PlayerDto) {
    this.gameService.getCalculatePoint(player).subscribe(res => {
      if (res.isSuccess) {
        console.log(res.data)
      }
      else {
        console.log('not winning', res.data)
      }
    })
  }

  cancelChow() {
    this.player.mahjong.handTiles.mahjongTile.forEach(m => {
      m.isSelected = false;
    });

    this.room.playerList.find(p => p.playerId === this.player.playerId)!.mahjong = this.player.mahjong;
    this.selectedChowList = [];
    this.chowVisible = false;
  }

  sendChow() {
    if (this.selectedChowList.length !== 2) {
      this.popMessage(this.translateService.instant("ACTION.MESSAGE.SELECTE_TILE_CHOW"), 'error');
    }
    else {
      this.socketIoService.sendChow(this.room, this.player, this.selectedChowList, this.room.mahjong.discardTiles[this.room.mahjong.discardTiles.length - 1]);
      this.cancelChow();
    }
  }

  returnIsShowingCancelButton(player: PlayerDto): boolean {
    return (player.action.isChowable || player.action.isKongable || player.action.isPongable || player.action.isSelfKongable || player.action.isWinnable);
  }

}
