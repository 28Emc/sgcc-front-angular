import { environment } from './../environments/environment.prod';
import { VexRoutes } from './../@vex/interfaces/vex-route.interface';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { AuthGuard } from './guards/auth.guard';

const routes: VexRoutes = [
  {
    path: 'auth/login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),
    title: `Login | ${environment.tituloSistemaFull}`
  },
  {
    path: '',
    component: CustomLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
            title: `Home | ${environment.tituloSistemaFull}`
          }
        ]
      },
      // TODO: AGREGAR MÁS COMPONENTES
      {
        path: '**',
        loadChildren: () => import('./pages/errors/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
        title: `Error 404 | ${environment.tituloSistemaFull}`
      }
    ]
  },
  {
    path: 'error-404',
    loadChildren: () => import('./pages/errors/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
    title: `Error 404 | ${environment.tituloSistemaFull}`
  },
  {
    path: 'error-500',
    loadChildren: () => import('./pages/errors/internal-server-error/internal-server-error.module').then(m => m.InternalServerErrorModule),
    title: `Error 500 | ${environment.tituloSistemaFull}`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
