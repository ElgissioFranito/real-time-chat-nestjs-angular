import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'private',
    canActivate: [AuthGuard],
    loadChildren: () => import('./private/private.routes').then(m => m.routes)
  },
  {
    path: 'public',
    loadChildren: () => import('./public/public.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: 'public',
    pathMatch: 'full'
  }
];
