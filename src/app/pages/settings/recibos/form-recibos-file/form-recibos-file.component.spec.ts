import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecibosFileComponent } from './form-recibos-file.component';

describe('FormRecibosFileComponent', () => {
  let component: FormRecibosFileComponent;
  let fixture: ComponentFixture<FormRecibosFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRecibosFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRecibosFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
