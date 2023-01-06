import { WidgetPieChartComponent } from './widget-pie-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChartModule } from '../../chart/chart.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [WidgetPieChartComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ChartModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [WidgetPieChartComponent]
})
export class WidgetPieChartModule { }
