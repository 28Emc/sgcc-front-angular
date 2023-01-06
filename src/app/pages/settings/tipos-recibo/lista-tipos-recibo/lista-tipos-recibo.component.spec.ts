import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTiposReciboComponent } from './lista-tipos-recibo.component';

describe('ListaTiposReciboComponent', () => {
  let component: ListaTiposReciboComponent;
  let fixture: ComponentFixture<ListaTiposReciboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTiposReciboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTiposReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
