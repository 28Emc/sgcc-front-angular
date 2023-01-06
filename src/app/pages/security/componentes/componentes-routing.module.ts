import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentesComponent } from './componentes.component';
import { ListaComponentesComponent } from './lista-componentes/lista-componentes.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentesComponent,
    children: [
      {
        path: 'lista',
        component: ListaComponentesComponent
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
export class ComponentesRoutingModule { }
