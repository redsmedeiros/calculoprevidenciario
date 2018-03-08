import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsMatrizRouting } from './rgps-matriz.routing';
import {RgpsMatrizComponent} from "./rgps-matriz.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    rgpsMatrizRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule
  ],
  declarations: [RgpsMatrizComponent]
})
export class RgpsMatrizModule { }
