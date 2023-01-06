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
      {
        path: 'mantenimiento',
        children: [
          {
            path: 'inquilinos',
            loadChildren: () => import('./pages/settings/inquilinos/inquilinos.module').then(m => m.InquilinosModule),
            title: `Mantenimiento Inquilinos | ${environment.tituloSistemaFull}`
          },
          {
            path: 'tipos-recibo',
            loadChildren: () => import('./pages/settings/tipos-recibo/tipos-recibo.module').then(m => m.TiposReciboModule),
            title: `Mantenimiento Tipos Recibo | ${environment.tituloSistemaFull}`
          },
          {
            path: 'recibos',
            loadChildren: () => import('./pages/settings/recibos/recibos.module').then(m => m.RecibosModule),
            title: `Mantenimiento Recibos | ${environment.tituloSistemaFull}`
          },
          {
            path: 'lecturas-medidor',
            loadChildren: () => import('./pages/settings/lecturas-medidor/lecturas-medidor.module').then(m => m.LecturasMedidorModule),
            title: `Mantenimiento Lect. Medidor | ${environment.tituloSistemaFull}`
          }
        ]
      },
      {
        path: 'seguridad',
        children: [
          {
            path: 'roles',
            loadChildren: () => import('./pages/security/roles/roles.module').then(m => m.RolesModule),
            title: `Seguridad Roles | ${environment.tituloSistemaFull}`
          },
          {
            path: 'usuarios',
            loadChildren: () => import('./pages/security/usuarios/usuarios.module').then(m => m.UsuariosModule),
            title: `Seguridad Usuarios | ${environment.tituloSistemaFull}`
          },
          {
            path: 'componentes',
            loadChildren: () => import('./pages/security/componentes/componentes.module').then(m => m.ComponentesModule),
            title: `Seguridad Componentes | ${environment.tituloSistemaFull}`
          },
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
