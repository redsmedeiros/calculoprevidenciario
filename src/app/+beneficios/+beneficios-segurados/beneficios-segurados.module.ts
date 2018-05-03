import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { beneficiosSeguradosRouting } from './beneficios-segurados.routing';
import {BeneficiosSeguradosComponent} from './beneficios-segurados.component';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';
import { BeneficiosSeguradosFormComponent } from './beneficios-segurados-form/beneficios-segurados-form.component';
import { BeneficiosSeguradosDestroyComponent } from './beneficios-segurados-destroy/beneficios-segurados-destroy.component';
import { BeneficiosSeguradosIndexComponent } from './beneficios-segurados-index/beneficios-segurados-index.component';
import { BeneficiosSeguradosCreateComponent } from './beneficios-segurados-create/beneficios-segurados-create.component';
import { BeneficiosSeguradosEditComponent } from './beneficios-segurados-edit/beneficios-segurados-edit.component';


@NgModule({
  imports: [
    CommonModule,
    beneficiosSeguradosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [
    BeneficiosSeguradosComponent, BeneficiosSeguradosFormComponent, BeneficiosSeguradosDestroyComponent, BeneficiosSeguradosIndexComponent, BeneficiosSeguradosCreateComponent, BeneficiosSeguradosEditComponent
  ]
})
export class BeneficiosSeguradosModule { }
