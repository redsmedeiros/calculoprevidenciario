import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosResultadosRouting } from './beneficios-resultados.routing';
import {BeneficiosResultadosComponent} from "./beneficios-resultados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    beneficiosResultadosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [BeneficiosResultadosComponent]
})
export class BeneficiosResultadosModule { }
