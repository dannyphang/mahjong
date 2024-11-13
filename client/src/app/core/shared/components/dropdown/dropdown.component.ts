import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BaseFieldDataSourceControl } from '../base-field-control/base-data-source-control';
import { Dropdown } from 'primeng/dropdown';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-base-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BaseDropdownComponent
  extends BaseFieldDataSourceControl
  implements OnInit {
  @Input() override placeholder: string = 'INPUT.SELECT';
  @Input() searchable!: boolean;
  @Output() onItemSelected: EventEmitter<any> = new EventEmitter();
  @Input() defaultValue: any = null;
  @Input() showClear: boolean = true;
  @Input() containerClass = '';

  @ViewChild('dropdown') dropdown!: Dropdown;
  selectedName: string = '';
  filterChange = new Subject<string>();
  overlayWidth = 0;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.selectedName = this.getLabelByValue(
      this.fieldControl.value || this.defaultValue,
    );

    if (this.searchable === undefined) {
      this.searchable = this.options.length > 5;
    }

    if (this.virtualScroll) {
      this.filterChange
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((value) => {
          this.currentEvent.searchBy = value;
          this.getOptions('searchChange');
        });
    }

    if (this.disabled) {
      this.fieldControl.disable()
    }
  }

  onChange(event: any) {
    this.selectedName = this.getLabelByValue(event.value);
    this.onItemSelected.emit(event.value);
  }

  getLabelByValue(value: string | number) {
    const t =
      this.options?.find(
        (i) => JSON.stringify(i.value) === JSON.stringify(value),
      )?.label || '';
    return t;
  }

  onLazyLoad(event: { first: number; last: number }) {
    if (
      event.last > 0 &&
      event.last + 5 > this.options.length &&
      this.options.length < this.totalRecords &&
      !this.lazyLoading
    ) {
      this.getOptions('changePageIndex');
    }
  }
  onShow(event: any) {
    let element = event.element as HTMLElement;
    element.style.width = this.overlayWidth + 'px';
  }

  onClick(event: any) {
    let element = <HTMLElement>event.target.closest('p-dropdown');
    this.overlayWidth = element.offsetWidth;
  }
}
