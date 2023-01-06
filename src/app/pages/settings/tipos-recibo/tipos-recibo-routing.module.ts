import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaTiposReciboComponent } from './lista-tipos-recibo/lista-tipos-recibo.component';
import { TiposReciboComponent } from './tipos-recibo.component';

const routes: Routes = [
  {
    path: '',
    component: TiposReciboComponent,
    children: [
      {
        path: 'lista',
        component: ListaTiposReciboComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'lista',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposReciboRoutingModule { }
