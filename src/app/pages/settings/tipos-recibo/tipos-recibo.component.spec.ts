import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposReciboComponent } from './tipos-recibo.component';

describe('TiposReciboComponent', () => {
  let component: TiposReciboComponent;
  let fixture: ComponentFixture<TiposReciboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposReciboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
