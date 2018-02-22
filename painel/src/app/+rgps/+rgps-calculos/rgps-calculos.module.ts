import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsCalculosRouting } from './rgps-calculos.routing';
import {RgpsCalculosComponent} from "./rgps-calculos.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    rgpsCalculosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsCalculosComponent]
})
export class RgpsCalculosModule { }
