import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosSeguradosRouting } from './beneficios-segurados.routing';
import {BeneficiosSeguradosComponent} from "./beneficios-segurados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    beneficiosSeguradosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [BeneficiosSeguradosComponent]
})
export class BeneficiosSeguradosModule { }
