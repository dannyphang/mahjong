import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RoomComponent } from './room/room.component';
import { CharacterComponent } from './character/character.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'room/:id',
    component: RoomComponent,
    data: { breadcrumb: 'Room', title: 'Room' }
  },
  {
    path: 'character',
    component: CharacterComponent,
    data: { breadcrumb: 'Character', title: 'Character' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
