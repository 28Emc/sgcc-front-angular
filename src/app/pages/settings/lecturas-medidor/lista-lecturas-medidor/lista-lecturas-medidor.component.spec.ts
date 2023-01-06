import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLecturasMedidorComponent } from './lista-lecturas-medidor.component';

describe('ListaLecturasMedidorComponent', () => {
  let component: ListaLecturasMedidorComponent;
  let fixture: ComponentFixture<ListaLecturasMedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaLecturasMedidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaLecturasMedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
