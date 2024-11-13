import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { OptionsModel } from '../../../services/components.service';

export interface DropdownOptionConfig {
    label: string;
    value: any;
    disabled?: boolean;
    preIcon?: string;
}

export type DependOnFieldsDataSourceConfig =
    | UpdateOptionsDependOnFieldConfig
    | NotUpdateOptionsDependOnFieldConfig;

export interface UpdateOptionsDependOnFieldConfig {
    fields: string[] | EventEmitter<any>[];
    action: () => Observable<OptionsModel[]>;
    updateOptions: true;
    debounce?: number;
}

export interface NotUpdateOptionsDependOnFieldConfig {
    fields: string[] | EventEmitter<any>[];
    action: () => void;
    updateOptions?: false;
}
