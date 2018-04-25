import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesResultadosRouting } from './contribuicoes-resultados.routing';
import {ContribuicoesResultadosComponent} from "./contribuicoes-resultados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    contribuicoesResultadosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesResultadosComponent]
})
export class ContribuicoesResultadosModule { }
