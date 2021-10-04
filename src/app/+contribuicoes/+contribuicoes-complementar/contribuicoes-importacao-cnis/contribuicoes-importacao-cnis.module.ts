import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContribuicoesImportacaoCnisRouting } from './contribuicoes-importacao-cnis.routing';
import { ContribuicoesImportacaoCnisComponent } from "./contribuicoes-importacao-cnis.component";
import {SmartadminModule} from "../../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../../shared/ui/datatable/smartadmin-datatable.module";
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';


@NgModule({
  imports: [
    CommonModule,
    ContribuicoesImportacaoCnisRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    FileDropModule,
  ],
  declarations: [ContribuicoesImportacaoCnisComponent],
  providers: [],
})
export class ContribuicoesImportacaoCnisModule { }
