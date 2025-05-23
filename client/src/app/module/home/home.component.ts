import { Component, isDevMode, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../core/services/socketIo.service';
import { GameService, PlayerDto } from '../../core/services/game.service';
import { BaseCoreAbstract } from '../../core/shared/base/base-core.abstract';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UserDto } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseCoreAbstract implements OnInit {
  roomIdFormControl: FormControl = new FormControl(isDevMode() ? '123456' : "");
  user: UserDto | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private socketIoService: SocketioService,
    private gameService: GameService,
    private translateService: TranslateService,
    private authService: AuthService,
    private toastService: ToastService,
    protected override messageService: MessageService,
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.authService.user$
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        if (user) {
          this.user = user;
          if (!user.displayName) {
            this.toastService.addMultiple([{
              severity: 'warn',
              message: this.translateService.instant('INPUT.PROFILE_INCOMPLETE'),
              key: 'profileIncompleteWarn',
            },]);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createGame() {
    if (this.user?.displayName) {
      this.gameService.getPlayerByUserId(this.user.uid!).subscribe({
        next: res => {
          if (res.isSuccess) {
            this.socketIoService.currentPlayer = res.data[0];
            this.navigateToRoom(true);
          }
          else {
            this.gameService.createPlayer({
              userUid: this.authService.userC.uid,
              playerName: this.user?.displayName,
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

                this.navigateToRoom(true);
              }
            });
          }
        }
      })
    }
    else {
      this.toastService.addSingle({
        severity: 'error',
        message: this.translateService.instant('INPUT.PROFILE_INCOMPLETE'),
        key: 'profileIncomplete',
      });
    }
  }

  enterRoom() {
    if (this.user?.displayName) {
      this.gameService.getPlayerByUserId(this.user.uid!).subscribe({
        next: res => {
          if (res.isSuccess) {
            this.socketIoService.currentPlayer = res.data[0];
            this.navigateToRoom();
          }
          else {
            this.gameService.createPlayer({
              userUid: this.authService.userC.uid,
              playerName: this.user?.displayName,
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

                this.navigateToRoom();
              }
            });
          }
        }
      })
    }
    else {
      // this.toastService.clear('profileIncomplete')
      this.toastService.addSingle({
        severity: 'error',
        message: this.translateService.instant('INPUT.PROFILE_INCOMPLETE'),
        key: 'profileIncomplete',
      });
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
          this.toastService.addSingle({
            severity: 'error',
            message: this.translateService.instant('ROOM.NOT_FOUND'),
            key: 'roomNotFound',
          })
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
              this.toastService.addSingle({
                severity: 'error',
                message: this.translateService.instant('ACTION.MESSAGE.ROOM_MAX_PLAYER'),
                key: 'roomMaxPlayer',
              });
            }
          }
        },
        error: error => {
          this.toastService.addSingle({
            severity: 'error',
            message: this.translateService.instant('ROOM.NOT_FOUND'),
            key: 'roomNotFound',
          })
        }
      });
    }
  }
}
