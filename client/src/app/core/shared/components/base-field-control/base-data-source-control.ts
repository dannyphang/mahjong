import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DependOnFieldsDataSourceConfig,
  UpdateOptionsDependOnFieldConfig,
} from '../dropdown/dropdown.interface';
import {
  combineLatest,
  debounce,
  distinctUntilChanged,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { BaseFieldControlComponent } from './base-field-control';
import { ROW_PER_PAGE_DEFAULT } from '../../constants/common.constants';
import { BaseDataSourceActionEvent, VirtualScrollConfig, FormConfig, OptionsModel } from '../../../services/components.service';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: '', template: '' })
export abstract class BaseFieldDataSourceControl
  extends BaseFieldControlComponent
  implements OnInit, OnDestroy {
  @Input() dependOnFields: DependOnFieldsDataSourceConfig[] = [];
  @Input() override placeholder: string = 'INPUT.SELECT';
  @Input() dataSourceDependOn: string[] = [];
  @Input() dataSourceAction:
    | ((event?: BaseDataSourceActionEvent) => Observable<any>)
    | null = null;
  @Input() sortOption: boolean = false;
  @Input() options: {
    label?: any;
    value: any;
    disabled?: boolean;
    preIcon?: string;
  }[] = [];
  @Input() virtualScroll?: VirtualScrollConfig | true = undefined;
  @Input() totalRecords: number = 0;

  protected trackingField: Observable<any>[] | EventEmitter<any>[] = [];
  protected currentEvent: BaseDataSourceActionEvent;
  protected lazyLoading = false;
  protected destroy$ = new Subject();

  protected optionUpdated = new Subject();
  parentFieldConfig: FormConfig[] = [];

  ngOnInit(): void {
    if (
      this.dataSourceAction &&
      !this.dependOnFields.some((c) => c.updateOptions) &&
      !this.dataSourceDependOn.length
    ) {
      this.getOptions('initData');
    }

    if (this.dependOnFields.length) {
      const updateOptionsDependList = this.dependOnFields.find(
        (c) => c.updateOptions,
      ) as UpdateOptionsDependOnFieldConfig;

      if (updateOptionsDependList) {
        this.trackingField = updateOptionsDependList.fields.map(
          (c: string | EventEmitter<any>) =>
            c instanceof EventEmitter
              ? c
              : this.parentFieldConfig.find((field) => field.id === c)
                ?.fieldControl?.valueChanges,
        ) as Observable<any>[] | EventEmitter<any>[];
        this.invokeDependent({
          debounce: updateOptionsDependList.debounce || 0,
          action: updateOptionsDependList.action,
        });
      }
    }

    if (this.dataSourceDependOn.length) {
      this.trackingField = this.dataSourceDependOn.map(
        (c: string | EventEmitter<any>) =>
          c instanceof EventEmitter
            ? c
            : this.parentFieldConfig
              .find((field) => field.id === c)
              ?.fieldControl?.valueChanges.pipe(startWith('')),
      ) as Observable<any>[] | EventEmitter<any>[];

      this.invokeDependent({
        debounce: 0,
        action: () => {
          if (this.dataSourceAction) {
            const event = this.buildEventAction('dependChange');
            return this.dataSourceAction(event);
          } else {
            console.error('Not have dataSourceAction');
            return of([]);
          }
        },
      });
    }
  }

  protected invokeDependent(updateOptionsDependList: {
    debounce: number;
    action: () => Observable<any>;
  }) {
    combineLatest(this.trackingField as Observable<any>[])
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounce((_) => timer(updateOptionsDependList.debounce || 0)),
      )
      .subscribe((val) => {
        updateOptionsDependList
          .action()
          .pipe(takeUntil(this.destroy$), distinctUntilChanged())
          .subscribe(
            (
              val:
                | OptionsModel[]
                | { options: OptionsModel[]; totalRecords: number },
            ) => {
              this.updatedOptions(val);
            },
          );
      });
  }

  protected getOptions(eventType: BaseDataSourceActionEvent['eventType']) {
    if (this.dataSourceAction) {
      this.lazyLoading = true;
      const event = this.buildEventAction(eventType);
      this.dataSourceAction(event)
        .pipe(tap(() => (this.lazyLoading = false)))
        .subscribe(
          (
            val:
              | OptionsModel[]
              | { options: OptionsModel[]; totalRecords: number },
          ) => {
            this.updatedOptions(val, eventType);
          },
        );
    }
  }

  protected buildEventAction(
    eventType: BaseDataSourceActionEvent['eventType'],
  ): BaseDataSourceActionEvent {
    switch (eventType) {
      case 'initData':
      case 'dependChange':
        this.currentEvent = {
          pageIndex: 1,
          rowPerPage: ROW_PER_PAGE_DEFAULT,
          eventType,
        };
        break;
      case 'searchChange':
        this.currentEvent = {
          pageIndex: 1,
          rowPerPage: ROW_PER_PAGE_DEFAULT,
          eventType,
          searchBy: this.currentEvent.searchBy,
        };
        break;
      case 'changePageIndex':
        this.currentEvent = {
          pageIndex: (this.currentEvent?.pageIndex || 1) + 1,
          rowPerPage: ROW_PER_PAGE_DEFAULT,
          eventType,
          searchBy: this.currentEvent.searchBy,
        };
        break;
      default:
        this.currentEvent = {
          eventType: 'other',
          rowPerPage: ROW_PER_PAGE_DEFAULT,
        };
        break;
    }
    this.currentEvent.defaultValue = this.fieldControl.value;
    return this.currentEvent;
  }

  protected updatedOptions(
    val: OptionsModel[] | { options: OptionsModel[]; totalRecords: number },
    eventType = '',
  ) {
    this.lazyLoading = false;
    if (eventType !== 'changePageIndex') {
      this.options = Array.isArray(val) ? val : val.options;
    } else {
      this.options = Array.isArray(val)
        ? val
        : this.options.concat(val.options);
    }
    this.optionUpdated.next(true);

    if (this.virtualScroll && !Array.isArray(val)) {
      this.totalRecords = val.totalRecords;
    }

    if (
      !this.virtualScroll &&
      this.fieldControl.value &&
      this.fieldControl.value.length &&
      this.options.every(
        (option) => !this.fieldControl.value.includes(option.value),
      )
    ) {
      this.fieldControl.reset({ emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
