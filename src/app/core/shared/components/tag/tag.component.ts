import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  @Input() label: string = '';
  @Input() color?: string = '';
  @Input() icon?: string = '';
  @Input() rounded: boolean = false;
  @Input() severity: 'success' | 'info' | 'warning' | 'danger' = 'info';
}
