import { Component, Input } from '@angular/core';
import { RoomDto, PlayerDto, GameService, MahjongDto } from '../../../core/services/game.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SocketioService } from '../../../core/services/socketIo.service';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';

@Component({
  selector: 'app-mahjong-table',
  templateUrl: './mahjong-table.component.html',
  styleUrl: './mahjong-table.component.scss'
})
export class MahjongTableComponent {
  @Input() room: RoomDto;
  @Input() player: PlayerDto;

  returnPlayerDirectionLabel(increaseNumber: number): number {
    let num = this.player?.direction + increaseNumber;

    if (num > 3) {
      num -= 3;
    }

    return num;
  }
}
