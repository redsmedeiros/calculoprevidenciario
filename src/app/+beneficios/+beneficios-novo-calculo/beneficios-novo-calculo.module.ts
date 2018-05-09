import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosNovoCalculoRouting } from './beneficios-novo-calculo.routing';
import {BeneficiosNovoCalculoComponent} from "./beneficios-novo-calculo.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "left",
    allowNegative: false,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: "."
};

@NgModule({
  imports: [
    CommonModule,
    beneficiosNovoCalculoRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    TextMaskModule,
    CurrencyMaskModule,
  ],
  declarations: [BeneficiosNovoCalculoComponent],
  providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
})
export class BeneficiosNovoCalculoModule { }
