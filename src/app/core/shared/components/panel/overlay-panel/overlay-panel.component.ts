import { Component, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-overlay-panel',
  templateUrl: './overlay-panel.component.html',
  styleUrl: './overlay-panel.component.scss'
})
export class OverlayPanelComponent {
  @ViewChild('menu') panel?: OverlayPanel;
  constructor() { }
  togglePanel(): void {
    this.panel?.toggle(event);
  }
}
