import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosFormRecebidosComponent } from './beneficios-calculos-form-recebidos.component';

describe('BeneficiosCalculosFormRecebidosComponent', () => {
  let component: BeneficiosCalculosFormRecebidosComponent;
  let fixture: ComponentFixture<BeneficiosCalculosFormRecebidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosFormRecebidosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosFormRecebidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
