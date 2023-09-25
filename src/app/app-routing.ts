import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('./features/components').then((c) => c.TasksComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/components').then((c) => c.UsersComponent),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/tasks',
  },
];
