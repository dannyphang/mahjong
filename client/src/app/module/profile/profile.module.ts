import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ComponentsModule } from "../../core/shared/components/components.module";
import { MaterialModule } from '../../core/shared/modules/material.module';
import { PrimeNgModule } from '../../core/shared/modules/primeng.module';
import { CommonSharedModule } from '../../core/shared/modules/common-shared.module';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CommonSharedModule,
    ComponentsModule,
    MaterialModule,
    PrimeNgModule,
  ]
})
export class ProfileModule { }
