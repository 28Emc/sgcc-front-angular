import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentesComponent } from './form-componentes.component';

describe('FormComponentesComponent', () => {
  let component: FormComponentesComponent;
  let fixture: ComponentFixture<FormComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormComponentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
