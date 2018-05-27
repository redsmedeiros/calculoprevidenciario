import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesResultadosComplementarRouting } from './contribuicoes-resultados-complementar.routing';
import { ContribuicoesResultadosComplementarComponent } from './contribuicoes-resultados-complementar.component';
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";

@NgModule({
  imports: [
    CommonModule,
    contribuicoesResultadosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesResultadosComplementarComponent]
})
export class contribuicoesResultadosComplementarModule { }
