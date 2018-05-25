import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesCalculosRouting } from './contribuicoes-calculos.routing';
import {ContribuicoesCalculosComponent} from "./contribuicoes-calculos.component";
import { ContribuicoesCalculosDestroyComponent } from "./contribuicoes-calculos-destroy/contribuicoes-calculos-destroy.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    contribuicoesCalculosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesCalculosComponent, ContribuicoesCalculosDestroyComponent]
})
export class ContribuicoesCalculosModule { }
