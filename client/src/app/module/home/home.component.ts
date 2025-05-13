import { Component, isDevMode, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../core/services/socketIo.service';
import { GameService, MahjongActionDto, MahjongGroupDto, PlayerDto } from '../../core/services/game.service';
import { BaseCoreAbstract } from '../../core/shared/base/base-core.abstract';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseCoreAbstract implements OnInit {
  roomIdFormControl: FormControl = new FormControl(isDevMode() ? '123456' : "");
  usernameFormControl: FormControl = new FormControl('');
  pinFormControl: FormControl<number> = new FormControl();

  constructor(
    private router: Router,
    private socketIoService: SocketioService,
    private gameService: GameService,
    protected override messageService: MessageService,
    private translateService: TranslateService,
    private eventService: EventService,
    private authService: AuthService
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.usernameFormControl.setValue(user.displayName);
      }
    });
  }

  createGame() {
    if (this.usernameFormControl.value) {
      if (this.pinFormControl.value) {
        this.popMessage(this.translateService.instant('ACTION.MESSAGE.CREATING_ROOM'), "info");
        this.gameService.getPlayerByName(this.usernameFormControl.value, this.pinFormControl.value).subscribe({
          next: res => {
            if (res.isSuccess) {
              this.socketIoService.currentPlayer = res.data[0];

              this.eventService.createEventLog("room", "Player created room", `${res.data[0].playerName} created a room`);
              this.eventService.createEventLog("room", "Player join room", `${res.data[0].playerName} joined the room`);

              this.navigateToRoom(true);
            }
            else {
              this.gameService.createPlayer({
                userUid: this.authService.userC.uid,
                playerName: this.usernameFormControl.value,
                pin: this.pinFormControl.value,
                statusId: 1,
                mahjong: {
                  handTiles: {
                    mahjongTile: [],
                    point: 0
                  },
                  publicTiles: [{ mahjongTile: [] }],
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
                  isGetKong: false,
                  isGetPong: false,
                  isKaLong: false,
                  isSoloPong: false,
                  isStealKong: false,
                  isSoloDraw: false,
                },
                profileImage: this.authService.userC?.profilePhotoUrl ?? "",
              } as PlayerDto).subscribe(res3 => {
                if (res3.isSuccess) {
                  this.socketIoService.player = res3.data;

                  this.eventService.createEventLog("player", "New player", `New player created, ${res.data[0].playerName}`);
                  this.eventService.createEventLog("room", "Player join room", `${res.data[0].playerName} joined the room`);

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
              this.eventService.createEventLog("room", "Player join room", `${res.data[0].playerName} joined the room`);
              this.navigateToRoom();
            }
            else {
              this.gameService.createPlayer({
                userUid: this.authService.userC.uid,
                playerName: this.usernameFormControl.value,
                pin: this.pinFormControl.value,
                statusId: 1,
                mahjong: {
                  handTiles: {
                    mahjongTile: [],
                    point: 0
                  },
                  publicTiles: [{ mahjongTile: [] }],
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
                  isGetKong: false,
                  isGetPong: false,
                  isKaLong: false,
                  isSoloPong: false,
                  isStealKong: false,
                  isSoloDraw: false,
                },
                profileImage: this.authService.userC?.profilePhotoUrl ?? "",
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
      this.gameService.createRoom().subscribe({
        next: res2 => {
          if (res2.isSuccess) {
            this.socketIoService.room = res2.data;
            this.socketIoService.room.roomOwnerId = this.socketIoService.player.playerId;

            this.router.navigate(['/room', res2.data.roomId]);
          }
        },
        error: error => {
          this.popMessage(this.translateService.instant('ROOM.NOT_FOUND'), "error");
        }
      });
    }
    else {
      this.gameService.getRoomById(this.roomIdFormControl.value).subscribe({
        next: res2 => {
          if (res2.isSuccess) {
            if (res2.data.playerList.length < 3 || res2.data.playerList.find((p: any) => p === this.socketIoService.player.playerId)) {
              this.socketIoService.room = res2.data;
              this.router.navigate(['/room', this.roomIdFormControl.value]);
            }
            else {
              this.popMessage(this.translateService.instant('ACTION.MESSAGE.ROOM_MAX_PLAYER'), "error")
            }
          }
        },
        error: error => {
          this.popMessage(this.translateService.instant('ROOM.NOT_FOUND'), "error");
        }
      });
    }
  }
}
