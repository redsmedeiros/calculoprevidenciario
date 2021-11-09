import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosFormDevidosComponent } from './beneficios-calculos-form-devidos.component';

describe('BeneficiosCalculosFormDevidosComponent', () => {
  let component: BeneficiosCalculosFormDevidosComponent;
  let fixture: ComponentFixture<BeneficiosCalculosFormDevidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosFormDevidosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosFormDevidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
