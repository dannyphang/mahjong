import { Component } from '@angular/core';
import { GameService, MahjongDto, MahjongGroupDto, PlayerDto } from '../../../core/services/game.service';
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
  tempArray2: MahjongDto[] = [];
  mahjongOptions: OptionsModel[] = [];
  publicFormControl: FormControl<string[] | null> = new FormControl<string[]>([])
  handFormControl: FormControl<string[] | null> = new FormControl<string[]>([])
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
    this.publicFormControl.valueChanges.subscribe(mahjongList => {
      this.tempArray = [];
      mahjongList?.forEach(uid => {
        this.tempArray.push(this.mahjongList.find(m => m.uid === uid)!);
      })
    })
    this.handFormControl.valueChanges.subscribe(mahjongList => {
      this.tempArray2 = [];
      mahjongList?.forEach(uid => {
        this.tempArray2.push(this.mahjongList.find(m => m.uid === uid)!);
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

  drop(event: CdkDragDrop<MahjongDto[]>, mahjongList: MahjongDto[]) {
    moveItemInArray(mahjongList, event.previousIndex, event.currentIndex);
  }

  checkMahjongSetInfo() {
    if (this.tempArray.length + this.tempArray2.length !== 14) {
      this.popMessage('The mahjong set must be 14 tiles.', "Error", "error");
    }
    else {
      let mahjong: MahjongGroupDto = {
        publicTiles: {
          mahjongTile: this.tempArray,
          point: 0,
        },
        handTiles: {
          mahjongTile: this.tempArray2,
          point: 0,
        },
        flowerTiles: {
          mahjongTile: [],
          point: 0,
        }
      }

      let player: PlayerDto = {
        statusId: 1,
        direction: 1,
        mahjong: mahjong,
        playerName: 'a',
        action: {
          isPongable: false,
          isKongable: false,
          isChowable: false,
          isWinnable: false,
        }
      }
      this.gameService.getCalculatePoint(player).subscribe(res => {
        if (res.isSuccess) {
          this.points = res.data.points
        }
        else {
          this.popMessage(res.responseMessage, "Error", "error");
        }
      })
    }
  }
}
