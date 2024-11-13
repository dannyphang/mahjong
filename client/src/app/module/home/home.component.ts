import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../core/services/socketIo.service';
import { GameService } from '../../core/services/game.service';
import { BaseCoreAbstract } from '../../core/shared/base/base-core.abstract';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseCoreAbstract implements OnInit {
  roomIdFormControl: FormControl = new FormControl('');
  usernameFormControl: FormControl = new FormControl('');

  constructor(
    private router: Router,
    private socketIoService: SocketioService,
    private gameService: GameService,
    protected override messageService: MessageService
  ) {
    super(messageService);
  }

  ngOnInit() {

  }

  createGame() {
    if (this.usernameFormControl.value) {
      this.gameService.getPlayerByName(this.usernameFormControl.value).subscribe({
        next: res => {
          if (res.isSuccess) {
            this.socketIoService.currentPlayer = res.data[0];
            this.gameService.createRoom().subscribe(res2 => {
              if (res2.isSuccess) {
                this.socketIoService.room = res2.data;
                this.router.navigate(['/room', res2.data.roomId]);
              }
            })
          }
        },
        error: error => {
          this.gameService.createPlayer({
            playerName: this.usernameFormControl.value,
            statusId: 1,
            isOut: false,
          }).subscribe(res3 => {
            if (res3.isSuccess) {
              this.socketIoService.player = res3.data;

              this.gameService.createRoom().subscribe(res2 => {
                if (res2.isSuccess) {
                  this.socketIoService.room = res2.data;
                  this.router.navigate(['/room', res2.data.roomId]);
                }
              })
            }
          });
        }
      });
    }
    else {
      this.popMessage('Username cannot be empty before creating a room', "Error", "error")
    }
  }

  enterRoom() {
    if (this.usernameFormControl.value) {
      this.gameService.getPlayerByName(this.usernameFormControl.value).subscribe({
        next: res => {
          if (res.isSuccess) {
            this.socketIoService.player = res.data[0];
            this.gameService.getRoomById(this.roomIdFormControl.value).subscribe(res2 => {
              if (res2.isSuccess) {
                this.socketIoService.room = res2.data;
                this.router.navigate(['/room', this.roomIdFormControl.value]);
              }
            })
          }
        },
        error: error => {
          this.gameService.createPlayer({
            playerName: this.usernameFormControl.value,
            statusId: 1,
            isOut: false,
          }).subscribe(res => {
            if (res.isSuccess) {
              this.socketIoService.player = res.data;

              this.gameService.getRoomById(this.roomIdFormControl.value).subscribe(res2 => {
                if (res2.isSuccess) {
                  this.socketIoService.room = res2.data;
                  this.router.navigate(['/room', this.roomIdFormControl.value]);
                }
              })
            }
          });
        }
      });
    }
    else {
      this.popMessage('Username cannot be empty before creating a room', "Error", "error")
    }
  }

  character() {
    this.router.navigate(['/character']);
  }
}
