import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import { BeneficiosCalculosFormCustasProcessoComponent } from './beneficios-calculos-form-custas-processo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask-zero';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask-zero/src/currency-mask.config';
import { I18nModule } from 'app/shared/i18n/i18n.module';
import { BeneficiosCalculosModule } from '../beneficios-calculos.module';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowNegativeZero: false,
  allowZero: false,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
};


describe('BeneficiosCalculosFormCustasProcessoComponent', () => {
  let component: BeneficiosCalculosFormCustasProcessoComponent;
  let fixture: ComponentFixture<BeneficiosCalculosFormCustasProcessoComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosFormCustasProcessoComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [
        ModalModule.forRoot(),
        FormsModule,
        TextMaskModule,
        CurrencyMaskModule,
        I18nModule,
        // BeneficiosCalculosModule
],
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
