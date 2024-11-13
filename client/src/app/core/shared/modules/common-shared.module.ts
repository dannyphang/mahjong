import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [

    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        HttpClientModule,
        // BrowserModule, 
    ],
    providers: [],
})
export class CommonSharedModule { }
