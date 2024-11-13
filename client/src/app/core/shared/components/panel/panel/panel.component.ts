import { Component, EventEmitter, Input, Output, TemplateRef, ViewChildren } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  @ViewChildren('panel') panel?: Panel;
  @Input() toggleable?: boolean = true;
  @Input() showHeader?: boolean = true;
  @Input() showFooter?: boolean = true;
  @Input() header: string = '';
  @Input() collapseIcon: string = 'pi pi-caret-down';
  @Input() expandIcon: string = 'pi pi-caret-up';
  @Output() onModify = new EventEmitter<void>();
  constructor() { }
}
