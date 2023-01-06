import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTiposReciboComponent } from './form-tipos-recibo.component';

describe('FormTiposReciboComponent', () => {
  let component: FormTiposReciboComponent;
  let fixture: ComponentFixture<FormTiposReciboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTiposReciboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTiposReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
