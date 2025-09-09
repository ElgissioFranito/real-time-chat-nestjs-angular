import { Routes } from '@angular/router';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'create-room',
    component: CreateRoomComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
