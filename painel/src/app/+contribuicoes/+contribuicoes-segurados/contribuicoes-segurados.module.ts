import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesSeguradosRouting } from './contribuicoes-segurados.routing';
import {ContribuicoesSeguradosComponent} from "./contribuicoes-segurados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    contribuicoesSeguradosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesSeguradosComponent]
})
export class ContribuicoesSeguradosModule { }
