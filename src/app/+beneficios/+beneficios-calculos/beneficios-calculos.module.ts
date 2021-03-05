import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosCalculosRouting } from './beneficios-calculos.routing';
import {BeneficiosCalculosComponent} from './beneficios-calculos.component';
import {BeneficiosCalculosDestroyComponent} from './beneficios-calculos-destroy/beneficios-calculos-destroy.component';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';
import { BeneficiosCalculosCreateComponent } from './beneficios-calculos-create/beneficios-calculos-create.component';
import { BeneficiosCalculosEditComponent } from './beneficios-calculos-edit/beneficios-calculos-edit.component';
import { BeneficiosCalculosFormComponent } from './beneficios-calculos-form/beneficios-calculos-form.component';
import { BeneficiosCalculosIndexComponent } from './beneficios-calculos-index/beneficios-calculos-index.component';
import {I18nModule} from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
// import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

import { CurrencyMaskModule } from '@mvpproperties/ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from '@mvpproperties/ng2-currency-mask/src/currency-mask.config';

import { BeneficiosCalculosFormRecebidosComponent } from './beneficios-calculos-form-recebidos/beneficios-calculos-form-recebidos.component';
import { BeneficiosCalculosFormDevidosComponent } from './beneficios-calculos-form-devidos/beneficios-calculos-form-devidos.component';
import { BeneficiosCalculosFormCustasProcessoComponent } from './beneficios-calculos-form-custas-processo/beneficios-calculos-form-custas-processo.component';
 
// export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
//     align: 'left',
//     allowNegative: false,
//     decimal: ',',
//     precision: 2,
//     prefix: '',
//     suffix: '',
//     thousands: '.'
// };

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowNegativeZero: false,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.'
};

@NgModule({
  imports: [
    CommonModule,
    beneficiosCalculosRouting,
    SmartadminModule,
    TextMaskModule,
    SmartadminDatatableModule,
    CurrencyMaskModule
  ],
  declarations: [BeneficiosCalculosComponent,
              BeneficiosCalculosDestroyComponent,
              BeneficiosCalculosCreateComponent,
              BeneficiosCalculosEditComponent,
              BeneficiosCalculosFormComponent,
              BeneficiosCalculosIndexComponent,
              BeneficiosCalculosFormRecebidosComponent,
              BeneficiosCalculosFormDevidosComponent,
              BeneficiosCalculosFormCustasProcessoComponent],
  providers: [
  { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }]
})
export class BeneficiosCalculosModule { }
