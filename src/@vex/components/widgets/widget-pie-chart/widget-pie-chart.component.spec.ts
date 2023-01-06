import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPieChartComponent } from './widget-pie-chart.component';

describe('WidgetPieChartComponent', () => {
  let component: WidgetPieChartComponent;
  let fixture: ComponentFixture<WidgetPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
