import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  effect,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormConfig } from '../../../services/components.service';

@Component({
  selector: 'app-base-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class BaseFormComponent implements OnChanges, AfterContentChecked {
  @Input() formConfig: FormConfig[] = [];
  @ViewChildren('formItemContainer', { read: ViewContainerRef })
  formItemContainer!: ViewContainerRef[];

  formConfigSorted: any[] = [];

  constructor(
    private cfr: ChangeDetectorRef,
    private sanitized: DomSanitizer,
  ) {
    // effect(() => { }, {
    //   allowSignalWrites: true
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formConfig']) {
      this.sortFollowOrder();
    }
  }

  private sortFollowOrder() {
    this.formConfigSorted = this.formConfig;
    this.formConfigSorted.sort((a: FormConfig, b: FormConfig) => {
      if (a.layoutDefine.row < b.layoutDefine.row) {
        return -1;
      }
      if (a.layoutDefine.row > b.layoutDefine.row) {
        return 1;
      }
      return 0;
    });

    this.formConfigSorted = this.formConfigSorted.reduce(
      (rs, cur: FormConfig) => {
        if (cur.layoutDefine.row === rs[rs.length - 1]?.[0].layoutDefine.row) {
          rs[rs.length - 1].push(cur);
        } else {
          rs.push([cur]);
        }
        return rs;
      },
      [],
    );

    this.formConfigSorted.forEach((i: FormConfig[]) => {
      i.sort((a: FormConfig, b: FormConfig) => {
        if (a.layoutDefine.row < b.layoutDefine.row) {
          return -1;
        }
        if (a.layoutDefine.row > b.layoutDefine.row) {
          return 1;
        }
        return 0;
      });
    });
  }

  updateConfig(item: FormConfig) {
    if (item.fieldControl) {
      // UPDATE VISIBILITY AND ERROR MESSAGE
      // if(item.visibility === VISIBILITY.READ_ONLY) {
      //   item.fieldControl.setErrors(null);
      //   item.disabled = true
      // }
      if (item.visibility === 'hidden' && !item.keepValueOnHide) {
        item.fieldControl.reset(null, { emitEvent: false });
        item.fieldControl.setErrors(null);
      }

      // disable other items base on condition
      if (item.disabledBy && item.disableByCondition) {
        const dependency = this.formConfig.find(
          (x) => x.name === item.disabledBy,
        );
        if (dependency?.fieldControl?.value === item.disableByCondition) {
          item.fieldControl.setValue(null);
          item.fieldControl.disable();
        } else {
          item.fieldControl.enable();
        }
      }
    }

    return item;
  }

  ngAfterContentChecked() {
    this.cfr.detectChanges();
  }

  bypassSecurityTrustHtml(innerHtml: string) {
    return this.sanitized.bypassSecurityTrustHtml(innerHtml);
  }

  trackByRow(index: number, el: any) {
    if (el.id) return el.id;
    return el;
  }

  trackByCol(index: number, el: any) {
    return el;
  }
}
