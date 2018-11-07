import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';

import { ContagemTempoResultadosRoutes } from './contagem-tempo-resultados.routing';



@NgModule({
  imports: [
    CommonModule,
    ContagemTempoResultadosRoutes,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: []
})
export class ContagemTempoResultadosModule { }
