import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-translate-toggle',
  templateUrl: './translate-toggle.component.html',
  styleUrl: './translate-toggle.component.scss'
})
export class TranslateToggleComponent {
  @Input() translateVisible: boolean = true;
  @Output() translateVisibleEmit: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private translateService: TranslateService
  ) {

  }

  translateClick() {
    this.translateVisible = !this.translateVisible;
    console.log(this.translateVisible)
    if (this.translateVisible) {
      this.translateService.use('zh');
    }
    else {
      this.translateService.use('en');
    }
    this.translateVisibleEmit.emit(this.translateVisible);
  }
}
