import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { TextMaskModule } from 'angular2-text-mask';


import { importadorCnisRouting } from './importador-cnis.routing';
import { ImportadorCnisComponent } from './importador-cnis.component';
import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados/importador-cnis-segurados.component';
import { ImportadorCnisPeriodosComponent } from './+importador-cnis-periodos/importador-cnis-periodos.component';
import { ImportadorCnisCalculosComponent } from './+importador-cnis-calculos/importador-cnis-calculos.component';
import { ImportadorCnisPdfLoadComponent } from './+importador-cnis-pdf-load/importador-cnis-pdf-load.component';


@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    FileDropModule,
    TextMaskModule,
    importadorCnisRouting
  ],
  declarations: [
    ImportadorCnisComponent,
    ImportadorCnisSeguradosComponent,
    ImportadorCnisCalculosComponent,
    ImportadorCnisPeriodosComponent,
    ImportadorCnisPdfLoadComponent
  ],
  providers: []
})
export class ImportadorCnisModule { }
