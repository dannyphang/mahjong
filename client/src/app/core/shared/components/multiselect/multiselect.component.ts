import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFieldDataSourceControl } from '../base-field-control/base-data-source-control';
import { MultiSelect } from 'primeng/multiselect';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-base-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
})
export class BaseMultiselectComponent
  extends BaseFieldDataSourceControl
  implements OnInit {
  @Input() showClear: boolean = true;
  @ViewChild('multiselect') multiselect!: MultiSelect;
  filterChange = new Subject<string>();

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.virtualScroll) {
      this.filterChange
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((value) => {
          this.currentEvent.searchBy = value;
          this.getOptions('searchChange');
        });
    }
  }

  ngAfterViewInit() {
    this.override();
  }

  handleRemove(item: any) {
    this.fieldControl.markAsDirty();
    this.fieldControl.markAsTouched();
    this.fieldControl.setValue(
      this.fieldControl.value.filter((i: any) => i !== item),
    );
  }

  getChipLabel(item: any) {
    return this.options.find((i) => i.value === item)?.label || '';
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

  handleFilter(event: any) {
    if (this.virtualScroll) {
      this.currentEvent.searchBy = event.filter;
      this.getOptions('searchChange');
    }
  }

  private override() {
    const _this = this;

    const filterFunc = this.multiselect.activateFilter;
    this.multiselect.activateFilter = function () {
      if (!_this.virtualScroll) {
        filterFunc.call(this);
      }
    };
  }
}
