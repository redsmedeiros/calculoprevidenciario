import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosCalculosRouting } from './beneficios-calculos.routing';
import {BeneficiosCalculosComponent} from "./beneficios-calculos.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    beneficiosCalculosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [BeneficiosCalculosComponent]
})
export class BeneficiosCalculosModule { }
