
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { TextMaskModule } from 'angular2-text-mask';

import { RgpsCalculosCreateComponent } from './rgps-calculos-create/rgps-calculos-create.component';
import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy/rgps-calculos-destroy.component';
import { RgpsCalculosEditComponent } from './rgps-calculos-edit/rgps-calculos-edit.component';
import { RgpsCalculosFormComponent } from './rgps-calculos-form/rgps-calculos-form.component';
import { RgpsCalculosIndexComponent } from './rgps-calculos-index/rgps-calculos-index.component';
import { RgpsCalculosComponent } from './rgps-calculos.component';



@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    TextMaskModule,
    SmartadminDatatableModule,
  ],
  declarations: [
    RgpsCalculosComponent,
    RgpsCalculosEditComponent,
    RgpsCalculosFormComponent,
    RgpsCalculosIndexComponent,
    RgpsCalculosDestroyComponent,
    RgpsCalculosCreateComponent
  ],
  exports: [
    RgpsCalculosComponent,
    RgpsCalculosEditComponent,
    RgpsCalculosFormComponent,
    RgpsCalculosIndexComponent,
    RgpsCalculosDestroyComponent,
    RgpsCalculosCreateComponent
  ]
})
export class RgpsCalculosSharedModule { }
