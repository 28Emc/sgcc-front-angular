import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLecturasMedidorComponent } from './form-lecturas-medidor.component';

describe('FormLecturasMedidorComponent', () => {
  let component: FormLecturasMedidorComponent;
  let fixture: ComponentFixture<FormLecturasMedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormLecturasMedidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLecturasMedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
