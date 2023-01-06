import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LecturasMedidorComponent } from './lecturas-medidor.component';
import { ListaLecturasMedidorComponent } from './lista-lecturas-medidor/lista-lecturas-medidor.component';

const routes: Routes = [
  {
    path: '',
    component: LecturasMedidorComponent,
    children: [
      {
        path: 'lista',
        component: ListaLecturasMedidorComponent
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
export class LecturasMedidorRoutingModule { }
