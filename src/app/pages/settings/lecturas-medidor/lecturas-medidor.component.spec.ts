import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturasMedidorComponent } from './lecturas-medidor.component';

describe('LecturasMedidorComponent', () => {
  let component: LecturasMedidorComponent;
  let fixture: ComponentFixture<LecturasMedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturasMedidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturasMedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
