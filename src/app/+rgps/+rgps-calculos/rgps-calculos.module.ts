import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsCalculosRouting } from './rgps-calculos.routing';
import {RgpsCalculosComponent} from "./rgps-calculos.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { RgpsCalculosEditComponent } from './rgps-calculos-edit/rgps-calculos-edit.component';
import { RgpsCalculosFormComponent } from './rgps-calculos-form/rgps-calculos-form.component';
import { RgpsCalculosIndexComponent } from './rgps-calculos-index/rgps-calculos-index.component';
import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy/rgps-calculos-destroy.component';
import { RgpsCalculosCreateComponent } from './rgps-calculos-create/rgps-calculos-create.component';


@NgModule({
  imports: [
    CommonModule,
    rgpsCalculosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsCalculosComponent, RgpsCalculosEditComponent, RgpsCalculosFormComponent, RgpsCalculosIndexComponent, RgpsCalculosDestroyComponent, RgpsCalculosCreateComponent]
})
export class RgpsCalculosModule { }
