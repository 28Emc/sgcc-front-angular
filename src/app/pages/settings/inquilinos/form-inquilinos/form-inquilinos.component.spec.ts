import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInquilinosComponent } from './form-inquilinos.component';

describe('FormInquilinosComponent', () => {
  let component: FormInquilinosComponent;
  let fixture: ComponentFixture<FormInquilinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormInquilinosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInquilinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
