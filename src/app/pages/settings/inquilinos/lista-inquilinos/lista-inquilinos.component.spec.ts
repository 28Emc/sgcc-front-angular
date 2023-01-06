import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInquilinosComponent } from './lista-inquilinos.component';

describe('ListaInquilinosComponent', () => {
  let component: ListaInquilinosComponent;
  let fixture: ComponentFixture<ListaInquilinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInquilinosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInquilinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
