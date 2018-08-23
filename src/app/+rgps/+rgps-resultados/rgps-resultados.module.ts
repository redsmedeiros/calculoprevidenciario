import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsResultadosRouting } from './rgps-resultados.routing';
import {RgpsResultadosComponent} from "./rgps-resultados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { RgpsResultadosAnterior88Component } from './rgps-resultados-anterior88/rgps-resultados-anterior88.component';
import { RgpsResultadosEntre91e98Component } from './rgps-resultados-entre91e98/rgps-resultados-entre91e98.component';
import { RgpsResultadosApos99Component } from './rgps-resultados-apos99/rgps-resultados-apos99.component';


@NgModule({
  imports: [
    CommonModule,
    rgpsResultadosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsResultadosComponent, RgpsResultadosAnterior88Component, RgpsResultadosEntre91e98Component, RgpsResultadosApos99Component]
})
export class RgpsResultadosModule { }
