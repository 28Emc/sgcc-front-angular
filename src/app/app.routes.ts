import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const appRoutes: VexRoutes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      /* FIXME: AGREGAR LAS DEMÁS RUTAS A LOS COMPONENTES INTERNOS DEL SISTEMA */
    ]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
