import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsElementsRouting } from './rgps-elements.routing';
import {RgpsElementsComponent} from "./rgps-elements.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
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
    rgpsElementsRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    TextMaskModule,
    CurrencyMaskModule,
  ],
  declarations: [RgpsElementsComponent],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
],
})
export class RgpsElementsModule { }
