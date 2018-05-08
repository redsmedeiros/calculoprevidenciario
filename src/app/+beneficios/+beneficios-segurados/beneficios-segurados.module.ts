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
import {I18nModule} from "../../shared/i18n/i18n.module";
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  imports: [
    CommonModule,
    beneficiosSeguradosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule
  ],
  declarations: [
    BeneficiosSeguradosComponent, BeneficiosSeguradosFormComponent, BeneficiosSeguradosDestroyComponent, BeneficiosSeguradosIndexComponent, BeneficiosSeguradosCreateComponent, BeneficiosSeguradosEditComponent
  ]
})
export class BeneficiosSeguradosModule { }
