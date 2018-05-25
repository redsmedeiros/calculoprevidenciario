import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesComplementarRouting } from './contribuicoes-complementar.routing';
import {ContribuicoesComplementarComponent} from "./contribuicoes-complementar.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { ContribuicoesComplementarCreateComponent } from './contribuicoes-complementar-create/contribuicoes-complementar-create.component';
import { ContribuicoesComplementarDestroyComponent } from './contribuicoes-complementar-destroy/contribuicoes-complementar-destroy.component';
import { ContribuicoesComplementarEditComponent } from './contribuicoes-complementar-edit/contribuicoes-complementar-edit.component';
import { ContribuicoesComplementarFormComponent } from './contribuicoes-complementar-form/contribuicoes-complementar-form.component';
import { ContribuicoesComplementarIndexComponent } from './contribuicoes-complementar-index/contribuicoes-complementar-index.component';


@NgModule({
  imports: [
    CommonModule,
    contribuicoesComplementarRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesComplementarComponent, ContribuicoesComplementarCreateComponent, ContribuicoesComplementarDestroyComponent, ContribuicoesComplementarEditComponent, ContribuicoesComplementarFormComponent, ContribuicoesComplementarIndexComponent]
})
export class ContribuicoesComplementarModule { }
