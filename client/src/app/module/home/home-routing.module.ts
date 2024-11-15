import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RoomComponent } from './room/room.component';
import { MahjongDisplayComponent } from './mahjong-display/mahjong-display.component';

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
    path: 'mahjong',
    component: MahjongDisplayComponent,
    data: { breadcrumb: 'Mahjong', title: 'Mahjong' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
