import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LecturasMedidorRoutingModule } from './lecturas-medidor-routing.module';
import { FormLecturasMedidorComponent } from './form-lecturas-medidor/form-lecturas-medidor.component';
import { ListaLecturasMedidorComponent } from './lista-lecturas-medidor/lista-lecturas-medidor.component';
import { LecturasMedidorComponent } from './lecturas-medidor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    FormLecturasMedidorComponent,
    ListaLecturasMedidorComponent,
    LecturasMedidorComponent
  ],
  imports: [
    CommonModule,
    LecturasMedidorRoutingModule,
    DirectivesModule,
    PageLayoutModule,
    BreadcrumbsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    MatDividerModule,
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class LecturasMedidorModule { }
