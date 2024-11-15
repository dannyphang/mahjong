import { Component } from '@angular/core';
import { GameService, MahjongDto } from '../../../core/services/game.service';
import { MessageService } from 'primeng/api';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mahjong-display',
  templateUrl: './mahjong-display.component.html',
  styleUrl: './mahjong-display.component.scss'
})
export class MahjongDisplayComponent extends BaseCoreAbstract {
  mahjongList: MahjongDto[] = [];
  tempArray: MahjongDto[] = [];

  constructor(
    private gameService: GameService,
    protected override messageService: MessageService
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.gameService.getAllMahjong().subscribe(res => {
      if (res.isSuccess) {
        this.mahjongList = res.data;
        this.tempArray = this.shuffleArray(this.mahjongList, 14);
      }
    })
  }

  shuffleArray(array: any[], length: number = -1): any[] {
    if (length == -1) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }

      return array;
    }
    else {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      let tempArr = [];
      for (let i = 0; i < length - 1; i++) {
        tempArr.push(array[i])
      }
      return tempArr;
    }
  }

  drop(event: CdkDragDrop<MahjongDto[]>) {
    moveItemInArray(this.tempArray, event.previousIndex, event.currentIndex);
  }
}
