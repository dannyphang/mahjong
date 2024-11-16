import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { MahjongDto } from '../../../../services/game.service';

@Component({
  selector: 'app-mahjong',
  templateUrl: './mahjong.component.html',
  styleUrl: './mahjong.component.scss'
})
export class MahjongComponent {
  @Input() mahjong: MahjongDto = new MahjongDto();
  @Input() selectable: boolean = true;
  @Input() isHide: boolean = false;
  @Output() selectedTile: EventEmitter<MahjongDto> = new EventEmitter();

  selectTile() {
    if (this.selectable) {
      this.mahjong.isSelected = !this.mahjong.isSelected;
      this.selectedTile.emit(this.mahjong);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mahjong'] && changes['mahjong'].currentValue) {
      // console.log(this.mahjong)
    }
  }
}
