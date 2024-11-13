import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion-panel',
  templateUrl: './accordion-panel.component.html',
  styleUrl: './accordion-panel.component.scss'
})
export class AccordionPanelComponent {
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = true;
  @Input() isExpand: boolean;
  @Input() iconPos: "end" | "start" = "end";

  constructor() {

  }
}
