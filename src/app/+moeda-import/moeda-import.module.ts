import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { moedaImportRouting } from './moeda-import.routing';
import { MoedaImportComponent } from "./moeda-import.component";
import {SmartadminModule} from "../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { PapaParseModule } from 'ngx-papaparse';
import { AdminLoginComponent } from "../shared/user/admin-login/admin-login.component";

@NgModule({
  imports: [
    CommonModule,
    moedaImportRouting,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    FileDropModule,
    PapaParseModule,
  ],
  declarations: [MoedaImportComponent, AdminLoginComponent],
  providers: [],
})
export class MoedaImportModule { }
