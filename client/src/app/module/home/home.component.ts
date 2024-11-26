import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../core/services/socketIo.service';
import { GameService, MahjongActionDto, MahjongGroupDto, PlayerDto } from '../../core/services/game.service';
import { BaseCoreAbstract } from '../../core/shared/base/base-core.abstract';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseCoreAbstract implements OnInit {
  roomIdFormControl: FormControl = new FormControl('4XVPqIQ8BaTHw4ZvVgtn');
  usernameFormControl: FormControl = new FormControl('');
  pinFormControl: FormControl<number> = new FormControl();
  constructor(
    private router: Router,
    private socketIoService: SocketioService,
    private gameService: GameService,
    protected override messageService: MessageService,
    private translateService: TranslateService
  ) {
    super(messageService);
  }

  ngOnInit() {

  }

  createGame() {
    if (this.usernameFormControl.value) {
      if (this.pinFormControl.value) {
        this.popMessage(this.translateService.instant('ACTION.MESSAGE.CREATING_ROOM'), "info");
        this.gameService.getPlayerByName(this.usernameFormControl.value, this.pinFormControl.value).subscribe({
          next: res => {
            if (res.isSuccess) {
              this.socketIoService.currentPlayer = res.data[0];

              this.navigateToRoom(true);
            }
            else {
              this.gameService.createPlayer({
                playerName: this.usernameFormControl.value,
                pin: this.pinFormControl.value,
                statusId: 1,
                mahjong: {
                  handTiles: {
                    mahjongTile: [],
                    point: 0
                  },
                  publicTiles: [],
                  flowerTiles: {
                    mahjongTile: [],
                    point: 0
                  }
                },
                direction: 0,
                action: {
                  isPongable: false,
                  isKongable: false,
                  isChowable: false,
                  isWinnable: false,
                  isSelfKongable: false
                },
                drawAction: {
                  isDrawFlower: false,
                  isDrawKong: false,
                  isDrawSecondKong: false,
                  isDrawLastTile: false,
                  isGetPong: false,
                  isKaLong: false,
                  isSoloPong: false,
                  isStealKong: false,
                  isSoloDraw: false,
                }
              } as PlayerDto).subscribe(res3 => {
                if (res3.isSuccess) {
                  this.socketIoService.player = res3.data;

                  this.navigateToRoom(true);
                }
              });
            }
          },
          error: (error) => {
            this.popMessage(this.translateService.instant('ACTION.MESSAGE.INCORRECT_PIN'), "error");
          }
        });
      }
      else {
        this.popMessage(this.translateService.instant('ACTION.MESSAGE.MUST_ENTER_PIN'), "info");
      }
    }
    else {
      this.popMessage(this.translateService.instant('ACTION.MESSAGE.MUST_ENTER_PIN'), "error")
    }
  }

  enterRoom() {
    if (this.usernameFormControl.value) {
      if (this.pinFormControl.value) {
        this.popMessage(this.translateService.instant('ACTION.MESSAGE.ENTERING_ROOM'), "info");
        this.gameService.getPlayerByName(this.usernameFormControl.value, this.pinFormControl.value).subscribe({
          next: res => {
            if (res.isSuccess) {
              this.socketIoService.player = res.data[0];

              this.navigateToRoom();
            }
            else {
              this.gameService.createPlayer({
                playerName: this.usernameFormControl.value,
                pin: this.pinFormControl.value,
                statusId: 1,
                mahjong: {
                  handTiles: {
                    mahjongTile: [],
                    point: 0
                  },
                  publicTiles: [],
                  flowerTiles: {
                    mahjongTile: [],
                    point: 0
                  }
                },
                direction: 0,
                action: {
                  isPongable: false,
                  isKongable: false,
                  isChowable: false,
                  isWinnable: false,
                  isSelfKongable: false
                },
                drawAction: {
                  isDrawFlower: false,
                  isDrawKong: false,
                  isDrawSecondKong: false,
                  isDrawLastTile: false,
                  isGetPong: false,
                  isKaLong: false,
                  isSoloPong: false,
                  isStealKong: false,
                  isSoloDraw: false,
                }
              } as PlayerDto).subscribe(res => {
                if (res.isSuccess) {
                  this.socketIoService.player = res.data;

                  this.navigateToRoom();
                }
              });
            }
          },
          error: (error) => {
            this.popMessage(this.translateService.instant('ACTION.MESSAGE.INCORRECT_PIN'), "error");
          }
        });
      }
      else {
        this.popMessage(this.translateService.instant('ACTION.MESSAGE.MUST_ENTER_PIN'), "info");
      }

    }
    else {
      this.popMessage(this.translateService.instant('ACTION.MESSAGE.USERNAME_CANNOT_EMPTY'), "error")
    }
  }

  tile() {
    this.router.navigate(['/mahjong']);
  }

  navigateToRoom(isCreateRoom = false) {
    if (isCreateRoom) {
      this.gameService.createRoom().subscribe(res2 => {
        if (res2.isSuccess) {
          this.socketIoService.room = res2.data;
          this.socketIoService.room.roomOwnerId = this.socketIoService.player.playerId;

          this.router.navigate(['/room', res2.data.roomId]);
        }
      });
    }
    else {
      this.gameService.getRoomById(this.roomIdFormControl.value).subscribe(res2 => {
        if (res2.isSuccess) {
          if (res2.data.playerList.length < 3 || res2.data.playerList.find(p => p.playerId === this.socketIoService.player.playerId)) {
            this.socketIoService.room = res2.data;
            this.router.navigate(['/room', this.roomIdFormControl.value]);
          }
          else {
            this.popMessage(this.translateService.instant('ACTION.MESSAGE.ROOM_MAX_PLAYER'), "error")
          }
        }
      });
    }
  }
}
