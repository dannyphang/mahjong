import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss'
})
export class SidePanelComponent implements OnInit, OnChanges {
  @Input() visible: boolean = true;
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'right';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes)
  }

  ngOnInit() {
    console.log('visible', this.visible)
  }
}
