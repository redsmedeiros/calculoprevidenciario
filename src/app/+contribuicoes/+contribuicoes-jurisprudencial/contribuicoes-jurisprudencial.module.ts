import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesJurisprudencialRouting } from './contribuicoes-jurisprudencial.routing';
import {ContribuicoesJurisprudencialComponent} from "./contribuicoes-jurisprudencial.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import { TextMaskModule } from 'angular2-text-mask';
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    contribuicoesJurisprudencialRouting,
    SmartadminModule,
    TextMaskModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesJurisprudencialComponent]
})
export class ContribuicoesJurisprudencialModule { }
