import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BaseTabMenuItem, BaseMenuItem } from '../../../services/components.service';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrl: './tab-menu.component.scss'
})
export class TabMenuComponent {
  @Input() items: BaseTabMenuItem[] = [];
  @Input() activeIndex!: number;
  @Input() activeId!: string;
  @Input() disabled = false;
  @Output() tabChanges = new EventEmitter<any>();

  tabMenuItems: BaseMenuItem[] = [];
  activeMenuItem!: BaseTabMenuItem;


}
