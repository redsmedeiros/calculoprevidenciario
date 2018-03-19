import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosNovoCalculoRouting } from './beneficios-novo-calculo.routing';
import {BeneficiosNovoCalculoComponent} from "./beneficios-novo-calculo.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    beneficiosNovoCalculoRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [BeneficiosNovoCalculoComponent]
})
export class BeneficiosNovoCalculoModule { }
