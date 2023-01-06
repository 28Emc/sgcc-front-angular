import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Component, Input, OnInit } from '@angular/core';
import { ApexOptions } from '../../chart/chart.component';
import { defaultChartOptions } from 'src/@vex/utils/default-chart-options';

@Component({
  selector: 'vex-widget-pie-chart',
  templateUrl: './widget-pie-chart.component.html',
  styleUrls: ['./widget-pie-chart.component.scss'],
  animations: [fadeInUp400ms]
})
export class WidgetPieChartComponent implements OnInit {
  @Input() title: string;
  @Input() loader: boolean;
  @Input() series: ApexNonAxisChartSeries;
  @Input() options: ApexOptions = defaultChartOptions();

  constructor() { }

  ngOnInit() { }

}
