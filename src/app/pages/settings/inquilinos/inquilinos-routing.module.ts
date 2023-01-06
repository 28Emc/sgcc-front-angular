import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InquilinosComponent } from './inquilinos.component';
import { ListaInquilinosComponent } from './lista-inquilinos/lista-inquilinos.component';

const routes: Routes = [
  {
    path: '',
    component: InquilinosComponent,
    children: [
      {
        path: 'lista',
        component: ListaInquilinosComponent
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
export class InquilinosRoutingModule { }
