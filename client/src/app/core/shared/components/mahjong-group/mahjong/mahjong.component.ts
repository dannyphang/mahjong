import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MahjongDto } from '../../../../services/game.service';

@Component({
  selector: 'app-mahjong',
  templateUrl: './mahjong.component.html',
  styleUrl: './mahjong.component.scss'
})
export class MahjongComponent {
  @Input() mahjong: MahjongDto = new MahjongDto();
  @Input() disabled: boolean = false;
  @Input() selectable: boolean = true;
  @Input() isHide: boolean = false;
  @Output() selectedTile: EventEmitter<MahjongDto> = new EventEmitter();

  selectTile() {
    if (this.selectable) {
      this.mahjong.isSelected = true;
      this.selectedTile.emit(this.mahjong);
    }
  }
}
