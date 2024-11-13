import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-base-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class BaseLabelComponent implements OnInit, OnChanges {
  @Input() mode: 'normal' | 'error' = 'normal';
  @Input() label: string | { key: string; param: object } = '';
  @Input() labelOneLine = false;
  @Input() showOptionalText = false;
  @Input() required = false;
  @Input() optionalText = false;
  @Input() labelStyle: string = '';
  @Input() iconLabelTooltip: string | { key: string; param: object } = '';

  labelKey!: string;
  param!: object;

  iconLabelTooltipKey!: string;
  iconLabelTooltipParam!: object;

  constructor() { }
  ngOnInit(): void {
    if (this.label && typeof this.label !== 'string') {
      this.param = this.label.param;
      this.labelKey = this.label.key;
    } else {
      this.labelKey = this.label as string;
    }

    if (this.iconLabelTooltip && typeof this.iconLabelTooltip !== 'string') {
      this.iconLabelTooltipParam = this.iconLabelTooltip.param;
      this.iconLabelTooltipKey = this.iconLabelTooltip.key;
    } else {
      this.iconLabelTooltipKey = this.iconLabelTooltip as string;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('label')) {
      const currentChange: string | { key: string; param: object } =
        changes['label'].currentValue;
      if (currentChange && typeof currentChange !== 'string') {
        this.labelKey = currentChange.key;
        this.param = currentChange.param;
      } else {
        this.labelKey = currentChange as string;
      }
    }
  }
}
