import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  @Input() label: string = '';
  @Input() removable: boolean = true;
  @Input() file: File;
  @Input() isFile: boolean = false;
  @Output() remove = new EventEmitter();

  constructor() {
  }

  onRemove() {
    if (this.isFile) {
      this.remove.emit(this.file);
    }
    else {
      this.remove.emit();
    }

  }
}
