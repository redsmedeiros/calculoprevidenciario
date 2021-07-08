import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

import { importadorCnisRouting } from './importador-cnis.routing';
import { ImportadorCnisComponent } from './importador-cnis.component';
import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados/importador-cnis-segurados.component';
import { ImportadorCnisPeriodosComponent } from './+importador-cnis-periodos/importador-cnis-periodos.component';
import { ImportadorCnisPdfLoadComponent } from './+importador-cnis-pdf-load/importador-cnis-pdf-load.component';
import { ImportadorCnisContribuicoesComponent } from './+importador-cnis-contribuicoes/importador-cnis-contribuicoes.component';
import { ImportadorCnisCalculosComponent } from './+importador-cnis-calculos/importador-cnis-calculos.component';
import { ImportadorHomeComponent } from './importador-home/importador-home.component';
import { ImportadorCnisSeguradosListComponent } from './+importador-cnis-segurados/importador-cnis-segurados-list/importador-cnis-segurados-list.component';
import { ImportadorCnisCalculosListComponent } from './+importador-cnis-calculos/importador-cnis-calculos-list/importador-cnis-calculos-list.component';


export const CustomPeriodosCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.'
};

@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    SmartadminDatatableModule,
    FormsModule,
    FileDropModule,
    TextMaskModule,
    CurrencyMaskModule,
    importadorCnisRouting,
  ],
  declarations: [
    ImportadorCnisComponent,
    ImportadorCnisSeguradosComponent,
    ImportadorCnisPeriodosComponent,
    ImportadorCnisPdfLoadComponent,
    ImportadorCnisContribuicoesComponent,
    ImportadorCnisCalculosComponent,
    ImportadorHomeComponent,
    ImportadorCnisSeguradosListComponent,
    ImportadorCnisCalculosListComponent,
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomPeriodosCurrencyMaskConfig }
  ],
})
export class ImportadorCnisModule { }
