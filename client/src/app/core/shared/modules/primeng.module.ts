import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from "primeng/inputtextarea";
import { CalendarModule } from "primeng/calendar";
import { RadioButtonModule } from "primeng/radiobutton";
import { MultiSelectModule } from "primeng/multiselect";
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from "primeng/button";
import { SplitButtonModule } from "primeng/splitbutton";
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TerminalModule, TerminalService } from 'primeng/terminal';
import { RippleModule } from "primeng/ripple";
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from "primeng/accordion";
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { TagModule } from 'primeng/tag';
import { AutoFocusModule } from 'primeng/autofocus';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { BlockUIModule } from 'primeng/blockui';
import { AvatarModule } from 'primeng/avatar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitterModule } from 'primeng/splitter';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { DragDropModule } from 'primeng/dragdrop';
import { PickListModule } from 'primeng/picklist';
import { DividerModule } from 'primeng/divider';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputOtpModule } from 'primeng/inputotp';

import { MessageService } from 'primeng/api';

const PRIMENG_MODULES = [
    InputNumberModule,
    TranslateModule,
    InputSwitchModule,
    ToastModule,
    TooltipModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    ProgressSpinnerModule,
    InputTextareaModule,
    CalendarModule,
    RadioButtonModule,
    ButtonModule,
    SplitButtonModule,
    MultiSelectModule,
    ChipModule,
    SidebarModule,
    RippleModule,
    OverlayPanelModule,
    PanelModule,
    AccordionModule,
    ChipModule,
    TerminalModule,
    TabViewModule,
    TabMenuModule,
    TagModule,
    AutoFocusModule,
    BreadcrumbModule,
    TableModule,
    BlockUIModule,
    AvatarModule,
    TieredMenuModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    SplitterModule,
    EditorModule,
    FileUploadModule,
    ScrollPanelModule,
    MenubarModule,
    MenuModule,
    DragDropModule,
    PickListModule,
    DividerModule,
    TreeSelectModule,
    InputOtpModule
]

@NgModule({
    imports: [
        PRIMENG_MODULES
    ],
    exports: [
        PRIMENG_MODULES
    ],
    providers: [
        MessageService,
        TerminalService
    ]
})

export class PrimeNgModule { }