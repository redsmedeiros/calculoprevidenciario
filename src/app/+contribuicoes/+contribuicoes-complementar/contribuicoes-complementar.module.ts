import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesComplementarRouting } from './contribuicoes-complementar.routing';
import {ContribuicoesComplementarComponent} from "./contribuicoes-complementar.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    contribuicoesComplementarRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesComplementarComponent]
})
export class ContribuicoesComplementarModule { }
