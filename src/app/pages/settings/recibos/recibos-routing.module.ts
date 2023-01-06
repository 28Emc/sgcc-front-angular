import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaRecibosComponent } from './lista-recibos/lista-recibos.component';
import { RecibosComponent } from './recibos.component';

const routes: Routes = [
  {
    path: '',
    component: RecibosComponent,
    children: [
      {
        path: 'lista',
        component: ListaRecibosComponent
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
export class RecibosRoutingModule { }
