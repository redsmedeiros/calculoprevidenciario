import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsValoresContribuidosRouting } from './rgps-valores-contribuidos.routing';
import {RgpsValoresContribuidosComponent} from "./rgps-valores-contribuidos.component";
import {RgpsMatrizComponent} from './rgps-valores-contribuidos-matriz/rgps-valores-contribuidos-matriz.component'
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "left",
    allowNegative: false,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
};

@NgModule({
  imports: [
    CommonModule,
    rgpsValoresContribuidosRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    TextMaskModule,
    CurrencyMaskModule
  ],
  declarations: [RgpsValoresContribuidosComponent, RgpsMatrizComponent],
  providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
})
export class RgpsValoresContribuidosModule { }
