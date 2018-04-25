import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contribuicoesSeguradosRouting } from './contribuicoes-segurados.routing';
import {ContribuicoesSeguradosComponent} from "./contribuicoes-segurados.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";

import { ContribuicoesSeguradosFormComponent } from './contribuicoes-segurados-form/contribuicoes-segurados-form.component';
import { ContribuicoesSeguradosDestroyComponent } from './contribuicoes-segurados-destroy/contribuicoes-segurados-destroy.component';
import { ContribuicoesSeguradosIndexComponent } from './contribuicoes-segurados-index/contribuicoes-segurados-index.component';
import { ContribuicoesSeguradosCreateComponent } from './contribuicoes-segurados-create/contribuicoes-segurados-create.component';
import { ContribuicoesSeguradosEditComponent } from './contribuicoes-segurados-edit/contribuicoes-segurados-edit.component';



@NgModule({
  imports: [
    CommonModule,
    contribuicoesSeguradosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [ContribuicoesSeguradosComponent,
  					ContribuicoesSeguradosFormComponent,
  					ContribuicoesSeguradosDestroyComponent,
  					ContribuicoesSeguradosIndexComponent,
  					ContribuicoesSeguradosCreateComponent,
  					ContribuicoesSeguradosEditComponent]
})
export class ContribuicoesSeguradosModule { }
