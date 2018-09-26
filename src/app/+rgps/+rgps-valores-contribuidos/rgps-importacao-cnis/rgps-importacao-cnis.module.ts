import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsImportacaoCnisRouting } from './rgps-importacao-cnis.routing';
import { RgpsImportacaoCnisComponent } from "./rgps-importacao-cnis.component";
import {SmartadminModule} from "../../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../../shared/ui/datatable/smartadmin-datatable.module";
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';


@NgModule({
  imports: [
    CommonModule,
    rgpsImportacaoCnisRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    FileDropModule,
  ],
  declarations: [RgpsImportacaoCnisComponent],
  providers: [],
})
export class RgpsImportacaoCnisModule { }
