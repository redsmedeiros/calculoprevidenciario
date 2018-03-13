import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsResultadosRouting } from './rgps-resultados.routing';
import {RgpsResultadosComponent} from "./rgps-resultados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    rgpsResultadosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsResultadosComponent]
})
export class RgpsResultadosModule { }
