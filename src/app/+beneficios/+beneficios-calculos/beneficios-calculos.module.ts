import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosCalculosRouting } from './beneficios-calculos.routing';
import {BeneficiosCalculosComponent} from "./beneficios-calculos.component";
import {BeneficiosCalculosDestroyComponent} from "./beneficios-calculos-destroy/beneficios-calculos-destroy.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { BeneficiosCalculosCreateComponent } from './beneficios-calculos-create/beneficios-calculos-create.component';
import { BeneficiosCalculosEditComponent } from './beneficios-calculos-edit/beneficios-calculos-edit.component';
import { BeneficiosCalculosFormComponent } from './beneficios-calculos-form/beneficios-calculos-form.component';
import { BeneficiosCalculosIndexComponent } from './beneficios-calculos-index/beneficios-calculos-index.component';


@NgModule({
  imports: [
    CommonModule,
    beneficiosCalculosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [BeneficiosCalculosComponent,BeneficiosCalculosDestroyComponent, BeneficiosCalculosCreateComponent, BeneficiosCalculosEditComponent, BeneficiosCalculosFormComponent, BeneficiosCalculosIndexComponent]
})
export class BeneficiosCalculosModule { }
