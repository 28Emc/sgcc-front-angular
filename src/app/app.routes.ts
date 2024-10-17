import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'maintenance',
        children: [
          {
            path: 'users',
            loadComponent: () => import('./pages/maintenance/user/user.component').then(m => m.UserComponent)
          },
          {
            path: 'areas',
            loadComponent: () => import('./pages/maintenance/area/area.component').then(m => m.AreaComponent)
          },
          {
            path: 'services',
            loadComponent: () => import('./pages/maintenance/service/service.component').then(m => m.ServiceComponent)
          }
        ]
      },
      {
        path: 'management',
        children: [
          {
            path: 'consumptions',
            loadComponent: () => import('./pages/management/consumption/consumption.component').then(m => m.ConsumptionComponent)
          }
        ]
      },
      {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
