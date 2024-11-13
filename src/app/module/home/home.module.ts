import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CommonSharedModule } from '../../core/shared/modules/common-shared.module';
import { ComponentsModule } from '../../core/shared/components/components.module';
import { MaterialModule } from '../../core/shared/modules/material.module';
import { PrimeNgModule } from '../../core/shared/modules/primeng.module';
import { RoomComponent } from './room/room.component';
import { CharacterComponent } from './character/character.component';
import { WaitingRoomComponent } from './room/waiting-room/waiting-room.component';
import { GameStartRoomComponent } from './room/game-start-room/game-start-room.component';


@NgModule({
  declarations: [
    HomeComponent,
    RoomComponent,
    CharacterComponent,
    WaitingRoomComponent,
    GameStartRoomComponent,
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    HomeRoutingModule,
    ComponentsModule,
    MaterialModule,
    PrimeNgModule
  ],
})
export class HomeModule { }
