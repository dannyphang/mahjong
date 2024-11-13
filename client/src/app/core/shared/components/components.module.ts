import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInputComponent } from './input/input.component';
import { CommonSharedModule } from '../modules/common-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../modules/material.module';
import { PrimeNgModule } from '../modules/primeng.module';
import { BaseLabelComponent } from './label/label.component';
import { FormArrayComponent } from './form/form-array.component';
import { FormArrayItemComponent } from './form/form-array-item.component';
import { FormItemComponent } from './form/form-item.component';
import { BaseFormComponent } from './form/form.component';
import { BaseButtonComponent } from './button/button.component';
import { BaseCheckboxComponent } from './checkbox/checkbox.component';
import { BaseDatepickerComponent } from './datepicker/datepicker.component';
import { BaseMultiselectComponent } from './multiselect/multiselect.component';
import { BaseRadioComponent } from './radio/radio.component';
import { BaseTextareaComponent } from './textarea/textarea.component';
import { BaseDropdownComponent } from './dropdown/dropdown.component';
import { ToggleThemeComponent } from './toggle-theme/toggle-theme.component';
import { ToastComponent } from './toast/toast.component';
import { OverlayPanelComponent } from './panel/overlay-panel/overlay-panel.component';
import { PanelComponent } from './panel/panel/panel.component';
import { AccordionPanelComponent } from './panel/accordion-panel/accordion-panel.component';
import { ChipComponent } from './chip/chip.component';
import { TerminalComponent } from './terminal/terminal.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { SidePanelComponent } from './panel/side-panel/side-panel.component';
import { TagComponent } from './tag/tag.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { InputSwitchComponent } from './input-switch/input-switch.component';
import { EditorComponent } from './editor/editor.component';
import { OnlyNumberDirective } from '../directives/only-number.directive';
import { PasswordValidator } from '../directives/password.directive';

const components = [
  BaseInputComponent,
  BaseLabelComponent,
  FormItemComponent,
  BaseFormComponent,
  FormArrayComponent,
  FormArrayItemComponent,
  BaseButtonComponent,
  BaseCheckboxComponent,
  BaseDatepickerComponent,
  BaseDropdownComponent,
  BaseMultiselectComponent,
  BaseRadioComponent,
  BaseTextareaComponent,
  ToggleThemeComponent,
  ToastComponent,
  OverlayPanelComponent,
  PanelComponent,
  AccordionPanelComponent,
  ChipComponent,
  TerminalComponent,
  TabMenuComponent,
  SidePanelComponent,
  TagComponent,
  BreadcrumbComponent,
  InputSwitchComponent,
  EditorComponent,
];

@NgModule({
  declarations: [
    components,
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    MaterialModule,
    PrimeNgModule,
    ReactiveFormsModule,
    TranslateModule,
    OnlyNumberDirective,
    PasswordValidator
  ],
  exports: [
    components
  ]
})
export class ComponentsModule { }
