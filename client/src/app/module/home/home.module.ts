import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CommonSharedModule } from '../../core/shared/modules/common-shared.module';
import { ComponentsModule } from '../../core/shared/components/components.module';
import { MaterialModule } from '../../core/shared/modules/material.module';
import { PrimeNgModule } from '../../core/shared/modules/primeng.module';
import { RoomComponent } from './room/room.component';
import { MahjongDisplayComponent } from './mahjong-display/mahjong-display.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    HomeComponent,
    RoomComponent,
    MahjongDisplayComponent,
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    HomeRoutingModule,
    ComponentsModule,
    MaterialModule,
    PrimeNgModule,
  ],
})
export class HomeModule { }
