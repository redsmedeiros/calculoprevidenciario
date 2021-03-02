import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesComplementarRouting } from './contribuicoes-complementar.routing';
import { ContribuicoesComplementarComponent } from './contribuicoes-complementar.component';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { ContribuicoesComplementarCreateComponent } from './contribuicoes-complementar-create/contribuicoes-complementar-create.component';
import { ContribuicoesComplementarDestroyComponent } from './contribuicoes-complementar-destroy/contribuicoes-complementar-destroy.component';
import { ContribuicoesComplementarEditComponent } from './contribuicoes-complementar-edit/contribuicoes-complementar-edit.component';
import { ContribuicoesComplementarFormComponent } from './contribuicoes-complementar-form/contribuicoes-complementar-form.component';
import { ContribuicoesComplementarIndexComponent } from './contribuicoes-complementar-index/contribuicoes-complementar-index.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.'
};

@NgModule({
  imports: [
    CommonModule,
    contribuicoesComplementarRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    TextMaskModule,
    CurrencyMaskModule,
  ],
  exports: [ContribuicoesComplementarIndexComponent],
  declarations: [ContribuicoesComplementarComponent,
    ContribuicoesComplementarCreateComponent,
    ContribuicoesComplementarDestroyComponent,
    ContribuicoesComplementarEditComponent,
    ContribuicoesComplementarFormComponent,
    ContribuicoesComplementarIndexComponent],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
})
export class ContribuicoesComplementarModule { }
