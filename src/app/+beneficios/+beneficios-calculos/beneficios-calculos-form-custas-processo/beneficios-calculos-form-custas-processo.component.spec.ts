import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosFormCustasProcessoComponent } from './beneficios-calculos-form-custas-processo.component';

describe('BeneficiosCalculosFormCustasProcessoComponent', () => {
  let component: BeneficiosCalculosFormCustasProcessoComponent;
  let fixture: ComponentFixture<BeneficiosCalculosFormCustasProcessoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosFormCustasProcessoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosFormCustasProcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
