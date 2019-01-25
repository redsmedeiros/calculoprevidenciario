
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { ContagemTempoPeriodosComponent } from './contagem-tempo-periodos.component';
import { contagemTempoPeriodosRouting } from './contagem-tempo-periodos.routing';

export const CustomPeriodosCurrencyMaskConfig: CurrencyMaskConfig = {
    align: 'left',
    allowNegative: false,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: '',
    thousands: '.'
};

@NgModule({
  imports: [
    CommonModule,
    contagemTempoPeriodosRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    TextMaskModule,
    CurrencyMaskModule
  ],
  declarations: [ContagemTempoPeriodosComponent],
  providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomPeriodosCurrencyMaskConfig }
  ],
})
export class ContagemTempoPeriodosModule { }
