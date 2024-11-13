import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormArrayConfig, FORM_ARRAY_TOKEN } from '../../../services/components.service';

@Component({
  selector: 'app-base-form-array',
  templateUrl: './form-array.component.html',
})
export class FormArrayComponent implements OnInit, AfterViewInit {
  @Input() fields: FormArrayConfig[] = [];
  @Input() fieldControl: FormArray = new FormArray([] as any);
  @Input() label: string = '';
  @Input() addBtnLabel: string = 'Add more';
  @Input() removeBtnLabel: string = 'Remove';
  @ViewChildren('form', { read: ViewContainerRef })
  container!: QueryList<ViewContainerRef>;

  fieldConfigArr = [] as any;
  formArrayValue = [] as any;
  // formArrayControl = new FormArray([] as any);

  constructor(
    @Inject(FORM_ARRAY_TOKEN) private formArrItemComp: any,
    private cdf: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.buildOriginForm();

    if (!this.fieldControl.value) {
      this.fieldControl.setValue([{}]);
    }
  }

  ngAfterViewInit(): void {
    this.render();
    this.container.changes.subscribe((_val) => {
      this.render();
    });
  }

  getFieldsConfig(index: number): any {
    return this.fieldConfigArr[index];
  }

  handleAddForm(index: number) {
    const newForm = this.buildNewForm();
    this.fieldControl.insert(index + 1, newForm);
    this.formArrayValue = this.fieldControl.value;

    this.fieldConfigArr.splice(
      index + 1,
      0,
      this.fields.map((i) => ({
        ...i,
        fieldControl: this.fieldControl.controls[index + 1].get(
          i.fieldControlName,
        ),
      })),
    );
  }

  handleRemoveForm(i: number) {
    this.fieldControl.removeAt(i);
    this.formArrayValue = this.fieldControl.value;
    this.fieldConfigArr = this.fieldConfigArr.filter(
      (item: any, ind: number) => ind !== i,
    );
  }

  private render() {
    const container = this.container.toArray();
    this.fieldControl.value.forEach((item: any, index: number) => {
      if (container[index]) {
        container[index].clear();
        const formComp = container[index].createComponent<any>(
          this.formArrItemComp.arrayItem,
        );
        formComp.instance.formConfig = this.getFieldsConfig(index);
        formComp.instance.removeBtnLabel = this.removeBtnLabel;
        formComp.instance.addBtnLabel = this.addBtnLabel;
        formComp.instance.addForm.subscribe((val: any) => {
          this.handleAddForm(index);
        });
        formComp.instance.removeForm.subscribe((val: any) => {
          this.handleRemoveForm(index);
        });
      }
    });
    this.cdf.detectChanges();
  }

  private buildOriginForm() {
    const controls = (this.fieldControl.controls[0] as FormGroup).controls;

    const newForm = new FormGroup({});

    Object.keys(controls).forEach((key) => {
      const newControl = new FormControl(
        controls[key].value,
        controls[key].validator,
        controls[key].asyncValidator,
      );
      newForm.addControl(key, newControl);
    });
    newForm.reset();

    this.formArrayValue = this.fieldControl.value;

    this.fieldConfigArr = [
      this.fields.map((i) => ({
        ...i,
        fieldControl: this.fieldControl.controls[0].get(i.fieldControlName),
      })),
    ];
  }

  private buildNewForm() {
    const controls = (this.fieldControl.controls[0] as FormGroup).controls;
    const newForm = new FormGroup({});
    Object.keys(controls).forEach((key) => {
      const newControl = new FormControl(
        '',
        controls[key].validator,
        controls[key].asyncValidator,
      );
      newForm.addControl(key, newControl);
    });
    newForm.reset();

    return newForm;
  }
}
