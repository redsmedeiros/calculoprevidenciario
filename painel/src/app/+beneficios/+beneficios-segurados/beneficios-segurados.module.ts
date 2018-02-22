import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsElementsRouting } from './rgps-elements.routing';
import {RgpsElementsComponent} from "./rgps-elements.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    rgpsElementsRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsElementsComponent]
})
export class RgpsElementsModule { }
