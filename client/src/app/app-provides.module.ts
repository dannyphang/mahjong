import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormArrayItemComponent } from './core/shared/components/form/form-array-item.component';
import { FormArrayComponent } from './core/shared/components/form/form-array.component';
import { CONTROL_TYPE, BASE_UI_TOKEN, FORM_ARRAY_TOKEN } from './core/services/components.service';
import { BaseButtonComponent } from './core/shared/components/button/button.component';
import { BaseCheckboxComponent } from './core/shared/components/checkbox/checkbox.component';
import { BaseDatepickerComponent } from './core/shared/components/datepicker/datepicker.component';
import { BaseDropdownComponent } from './core/shared/components/dropdown/dropdown.component';
import { BaseInputComponent } from './core/shared/components/input/input.component';
import { BaseLabelComponent } from './core/shared/components/label/label.component';
import { BaseMultiselectComponent } from './core/shared/components/multiselect/multiselect.component';
import { BaseRadioComponent } from './core/shared/components/radio/radio.component';
import { BaseTextareaComponent } from './core/shared/components/textarea/textarea.component';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

export const allBaseUIForm = {
    [CONTROL_TYPE.Textbox]: BaseInputComponent,
    [CONTROL_TYPE.Textarea]: BaseTextareaComponent,
    [CONTROL_TYPE.Dropdown]: BaseDropdownComponent,
    [CONTROL_TYPE.Calendar]: BaseDatepickerComponent,
    [CONTROL_TYPE.Checkbox]: BaseCheckboxComponent,
    [CONTROL_TYPE.Radio]: BaseRadioComponent,
    [CONTROL_TYPE.Multiselect]: BaseMultiselectComponent,
    [CONTROL_TYPE.Label]: BaseLabelComponent,
    [CONTROL_TYPE.Button]: BaseButtonComponent,
};

export const providers = [
    { provide: ErrorHandler },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideAnimationsAsync(),
    {
        provide: BASE_UI_TOKEN,
        useValue: allBaseUIForm,
    },
    {
        provide: FORM_ARRAY_TOKEN,
        useValue: {
            [CONTROL_TYPE.FormArray]: FormArrayComponent,
            arrayItem: FormArrayItemComponent,
        },
    },
    { provide: MATERIAL_SANITY_CHECKS, useValue: false }, // disable material theme checking
];