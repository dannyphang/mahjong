import { ComponentRef, EventEmitter, InjectionToken } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ToastPositionType } from 'primeng/toast';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface BaseFormConfig {
    id?: string;
    type: CONTROL_TYPE;
    label?: string | { key: string; param?: object } | string[];
    name?: string;
    placeholder?: string;
    fieldControl?: FormControl | AbstractControl | null;
    errorMessageList?: ErrorMessageList;
    layoutDefine: {
        row: number;
        column: number;
        colSpan?: number;
    };
    required?: boolean;
    labelOneLine?: boolean;
    cssContainer?: string;
    disabled?: boolean;
    disabledBy?: string;
    disableByCondition?: any;
    visibility?: 'hidden' | 'visible';
    keepValueOnHide?: boolean;
    iconLabelTooltip?: string | { key: string; param: object };
    dependOnFields?: {
        fields: string[] | EventEmitter<any>[];
        action: (fieldConfig?: FormConfig, comp?: ComponentRef<any>) => void;
        debounce?: number;
    }[];
}

export enum CONTROL_TYPE {
    Textbox = 'textbox',
    Textarea = 'textarea',
    Dropdown = 'dropdown',
    Calendar = 'calendar',
    Checkbox = 'checkbox',
    Radio = 'radio',
    Multiselect = 'multiselect',
    FormArray = 'formarray',
    Label = 'label',
    Html = 'html',
    InputNumber = 'inputNumber',
    ButtonSet = 'buttonset',
    InputMask = 'inputmask',
    Button = 'button',
    // autocomplete = 'autocomplete'
}

export enum CONTROL_TYPE_CODE {
    Textbox = 'TXT_S',
    Textarea = 'TXT_M',
    Dropdown = 'SEL_S',
    Multiselect = 'SEL_M',
    Radio = 'RAD',
    Checkbox = 'CBX_S',
    MultiCheckbox = 'CBX_M',
    Number = 'NUM',
    Date = 'DATE',
    DateTime = 'DATETIME',
    Time = 'TIME',
    Url = 'URL',
    Email = 'EML',
    Phone = 'PHN',
    User = 'USR',
    Country = 'COUNTRY',
    State = 'STATE',
    City = 'CITY',
    Postcode = 'POSTCODE',
    Year = 'YEAR',
}

export const NUMBER_INPUT_FORMAT = {
    currency: new RegExp(/^RM \d{2}.\d{2}/gi),
};

interface ErrorMessageList {
    [key: string]: string | { key: string; param: object };
}

export interface OptionsModel {
    label?: string;
    value: any;
    preIcon?: string;
    disabled?: boolean;
}

export interface TreeOptionsModel {
    label?: any;
    value: any;
    expandedIcon?: string;
    collapsedIcon?: string;
    icon?: string;
    children?: TreeOptionsModel[];
}

export interface BaseInputTextConfig {
    autoFocus?: boolean;
}

export interface BaseInputFormConfig extends BaseFormConfig, BaseInputTextConfig {
    type: CONTROL_TYPE.Textbox;
    mode?: 'text' | 'number' | 'password' | 'switch' | 'label-text' | 'email' | 'url' | 'phone';
    prefix?: string;
    suffix?: string;
    onlyNumber?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    useGrouping?: boolean;
    content?: string;
    descriptionMessage?: string;
    labelTextStyle?: string;
}

export interface BaseDatepickerFormConfig extends BaseFormConfig {
    type: CONTROL_TYPE.Calendar;
    mode?: 'range' | 'single' | 'range_2' | 'label-text';
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
    view?: string;
    showTime?: boolean;
    timeOnly?: boolean;
}

export interface BaseTextAreaFormConfig extends BaseFormConfig, BaseInputTextConfig {
    type: CONTROL_TYPE.Textarea;
    labelShowsOptional?: boolean;
    hideLengthLimit?: boolean;
    maxLength?: number;
    autoResize?: boolean;
    instructionText?: string;
    tooltip?: string;
    lineNumber?: number;
}

export interface BaseHTMLFormConfig extends BaseFormConfig {
    type: CONTROL_TYPE.Html;
    dynamicHTML: string;
}

export type BaseSelectFormConfig = Omit<BaseFormConfig, 'dependOnFields'> &
    (BaseDataSourceAction | BaseDataSourceWithOptions) & {
        type:
        | CONTROL_TYPE.Radio
        | CONTROL_TYPE.Checkbox
        | CONTROL_TYPE.Dropdown
        | CONTROL_TYPE.Multiselect;
        direction?: 'row' | 'column';
        optionsContainerClass?: string;
        singleSelect?: boolean;
        switchInput?: boolean;
        defaultValue?: any;
        containerClass?: string;
        inputContainerClass?: string;
        labelClass?: string;
        defaultLabel?: string;
        dependOnFields?: {
            fields:
            | (
                | string
                | EventEmitter<any>
                | BehaviorSubject<any>
                | Subject<any>
                | Observable<any>
            )[];
            action: (
                fieldConfig?: BaseDropdownFormConfig,
                comp?: ComponentRef<any>,
            ) => void;
            updateOptions?: boolean;
            debounce?: number;
        }[];
    };

export type BaseDropdownFormConfig = BaseSelectFormConfig & {
    type: CONTROL_TYPE.Dropdown;
    searchable?: boolean;
    sortOption?: boolean;
    group?: boolean;
    showClear?: boolean;
};

export type BaseMultiselectFormConfig = BaseSelectFormConfig & {
    type: CONTROL_TYPE.Multiselect;
    defaultLabel?: string;
    searchable?: boolean;
    sortOption?: boolean;
    group?: boolean;
    showClear?: boolean;
};

export type BaseCheckBoxFormConfig = BaseSelectFormConfig & {
    type: CONTROL_TYPE.Checkbox;
};

export type BaseRadioFormConfig = BaseSelectFormConfig & {
    type: CONTROL_TYPE.Radio;
};

export interface BaseDataSourceAction {
    dataSourceAction: (event?: BaseDataSourceActionEvent) => Observable<any>;
    options?: undefined;
    dataSourceDependOn?: string[];
    virtualScroll?: VirtualScrollConfig | true;
}

export interface BaseDataSourceActionEvent {
    searchBy?: string;
    pageIndex?: number;
    rowPerPage?: number;
    eventType:
    | 'dependChange'
    | 'changePageIndex'
    | 'searchChange'
    | 'other'
    | 'initData';
    defaultValue?: any;
}

export interface VirtualScrollConfig {
    pageSize?: number;
}

export interface BaseDataSourceWithOptions {
    options: OptionsModel[];
}

export interface BaseFormArrayConfig extends BaseFormConfig {
    type: CONTROL_TYPE.FormArray;
    fields: FormArrayConfig[];
    fieldControl: FormArray;
    addBtnLabel?: string;
    removeBtnLabel?: string;
}

export type FormArrayConfig = FormConfig & {
    fieldControlName: string;
    fieldControl?: undefined;
};

export interface BaseLabelFormConfig extends BaseFormConfig {
    type: CONTROL_TYPE.Label;
    mode?: 'normal' | 'error';
    labelOneLine?: boolean;
    required?: boolean;
    labelStyle?: string;
}

export interface BaseButtonFormConfig extends BaseFormConfig {
    type: CONTROL_TYPE.Button;
    label?: string;
    outlined?: boolean;
    onClickFunc: (e?: any) => void;
    actionPermission?: {
        actionType: string | string[];
        moduleCode?: string;
        createdBy?: string;
    };
}

export const BASE_UI_TOKEN = new InjectionToken('BASE_UI_TOKEN');
export const FORM_ARRAY_ITEM_TOKEN = new InjectionToken(
    'FORM_ARRAY_ITEM_TOKEN',
);
export const FORM_ARRAY_TOKEN = new InjectionToken('FORM_ARRAY_TOKEN');

export type FormConfig =
    | BaseInputFormConfig
    | BaseTextAreaFormConfig
    | BaseDropdownFormConfig
    | BaseMultiselectFormConfig
    | BaseCheckBoxFormConfig
    | BaseRadioFormConfig
    | BaseDatepickerFormConfig
    | BaseHTMLFormConfig
    | BaseLabelFormConfig
    | BaseFormArrayConfig
    | BaseButtonFormConfig;

export function isBaseButton(
    config: FormConfig,
): config is BaseButtonFormConfig {
    return config.type === CONTROL_TYPE.Button;
}

export const BASE_FORM_ITEMS_EVENT = {
    OPTIONS_CHANGE: 'OPTIONS_CHANGE',
};

export interface BaseMenuItem {
    label: string;
    id: string;
    moduleCode?: string | object;
    actionType?: string | string[];
    disable?: boolean;
    command?: any;
}

export interface BaseTabMenuItem extends MenuItem {
    moduleCode?: string | object;
    actionType?: string | string[];
}

export interface ProtertiesDto {
    propertyId: string;
    uid: string;
    name: string;
    code: string;
    type: string;
    isSystem: boolean;
    isMandatory: boolean;
    isEditable: boolean;
    isVisiable: boolean;
    moduleCode: string;
    order: number;
    statusID: number;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
}

export interface TableConfig {
    header?: string;
    code: string;
    icon?: string;
}