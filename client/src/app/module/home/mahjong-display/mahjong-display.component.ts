import { Component } from '@angular/core';
import { GameService, MahjongDto } from '../../../core/services/game.service';
import { MessageService } from 'primeng/api';
import { BaseCoreAbstract } from '../../../core/shared/base/base-core.abstract';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OptionsModel } from '../../../core/services/components.service';
import { map } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mahjong-display',
  templateUrl: './mahjong-display.component.html',
  styleUrl: './mahjong-display.component.scss'
})
export class MahjongDisplayComponent extends BaseCoreAbstract {
  mahjongList: MahjongDto[] = [];
  tempArray: MahjongDto[] = [];
  mahjongOptions: OptionsModel[] = [];
  mahjongPlaygroundFormControl: FormControl<string[] | null> = new FormControl<string[]>([])
  points: number;

  constructor(
    private gameService: GameService,
    protected override messageService: MessageService
  ) {
    super(messageService);
  }

  ngOnInit() {
    let mahjongList2: MahjongDto[] = [];
    this.gameService.getAllMahjong().subscribe(res => {
      if (res.isSuccess) {
        this.mahjongList = res.data;
        // let tempList = this.mahjongList.filter((ma, index, self) => index === self.findIndex(m => m.code === ma.code))
        this.mahjongOptions = this.mahjongList.map(m => {
          return {
            label: `${m.name} (${m.uid})`,
            value: m.uid,
            preIcon: m.code
          }
        });
      }
    });
    this.mahjongPlaygroundFormControl.valueChanges.subscribe(mahjongList => {
      this.tempArray = [];
      mahjongList?.forEach(uid => {
        this.tempArray.push(this.mahjongList.find(m => m.uid === uid)!);
      })
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

  checkMahjongSetInfo() {
    if (this.tempArray.length !== 14) {
      this.popMessage('The mahjong set must be 14 tiles.', "Error", "error");
    }
    else {
      this.gameService.getCalculatePoint(this.tempArray).subscribe(res => {
        if (res.isSuccess) {
          this.points = res.data.points
        }
      })
    }
  }
}
