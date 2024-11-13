import {
  Component,
  ComponentRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseButtonComponent } from '../button/button.component';
import {
  combineLatest,
  debounce,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  timer,
} from 'rxjs';
import { FormConfig, BASE_UI_TOKEN, FORM_ARRAY_TOKEN, isBaseButton, BaseButtonFormConfig, CONTROL_TYPE, BASE_FORM_ITEMS_EVENT } from '../../../services/components.service';

@Component({
  selector: 'app-form-item',
  template: '<ng-container #formItemContainer></ng-container>',
})
export class FormItemComponent implements OnInit, OnDestroy {
  @ViewChild('formItemContainer', { read: ViewContainerRef, static: true })
  formItemContainer!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;
  destroy$ = new Subject();

  @Input() fieldConfig!: FormConfig;
  @Input() parentFieldConfig!: FormConfig[];

  constructor(
    @Inject(BASE_UI_TOKEN) private allBaseUIComp: any,
    @Inject(FORM_ARRAY_TOKEN) private formArray: any,
  ) { }

  ngOnInit(): void {
    this.formItemContainer.clear();
    this.renderItem();
  }

  private renderItem() {
    this.componentRef = this.formItemContainer.createComponent<any>(
      this.allBaseUIComp[this.fieldConfig.type] ||
      this.formArray[this.fieldConfig.type],
    );

    Object.keys(this.fieldConfig).forEach((i: any) => {
      this.componentRef.instance[i] = (this.fieldConfig as any)[i];
    });
    this.componentRef.instance.parentFieldConfig = this.parentFieldConfig;
    this.componentRef.instance.disabled =
      this.fieldConfig.fieldControl?.disabled || this.fieldConfig.disabled;

    if (!this.fieldConfig.fieldControl) {
      this.componentRef.instance.fieldControl = new FormControl('');
    }

    if (this.fieldConfig.dependOnFields?.length) {
      this.invokeDependent();
    }

    if (isBaseButton(this.fieldConfig)) {
      (this.componentRef.instance as BaseButtonComponent).onClick
        .pipe(takeUntil(this.destroy$))
        .subscribe((val: any) => {
          (this.fieldConfig as BaseButtonFormConfig).onClickFunc(val);
        });
    }

    return this.componentRef.instance;
  }

  private invokeDependent() {
    this.fieldConfig.dependOnFields?.forEach((deps: any) => {
      if (
        (this.fieldConfig.type === CONTROL_TYPE.Dropdown ||
          this.fieldConfig.type === CONTROL_TYPE.Multiselect) &&
        (deps as any).updateOptions
      ) {
        return;
      }
      const trackingField = deps.fields.map((field: any) => {
        if (Object.values(BASE_FORM_ITEMS_EVENT).includes(field as string)) {
          switch (field) {
            case BASE_FORM_ITEMS_EVENT.OPTIONS_CHANGE:
              return this.componentRef.instance['optionUpdated'];
          }
        }
        if (typeof field === 'string') {
          return this.parentFieldConfig.find((i) => i.id === field)
            ?.fieldControl?.valueChanges;
        }
        return field;
      });

      combineLatest(trackingField as Observable<any>[])
        .pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged(),
          debounce((_) => timer(deps.debounce || 0)),
        )
        .subscribe((_) => {
          deps.action(this.fieldConfig as any, this.componentRef.instance);

          Object.keys(this.fieldConfig).forEach((i: any) => {
            this.componentRef.instance[i] = (this.fieldConfig as any)[i];
          });
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
