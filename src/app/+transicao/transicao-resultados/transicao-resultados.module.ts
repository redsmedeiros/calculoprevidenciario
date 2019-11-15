
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';

import { transicaoResultadosRouting } from './transicao-resultados.routing';
import { TransicaoResultadosComponent } from './transicao-resultados.component';


import { TransicaoResultadosPontosComponent } from './transicao-resultados-pontos/transicao-resultados-pontos.component';
import { TransicaoResultadosIdadeComponent } from './transicao-resultados-idade/transicao-resultados-idade.component';
import { TransicaoResultadosPedagio100Component } from './transicao-resultados-pedagio100/transicao-resultados-pedagio100.component';
import { TransicaoResultadosPedagio50Component } from './transicao-resultados-pedagio50/transicao-resultados-pedagio50.component';
import { TransicaoResultadosIdadeProgressivaComponent } from './transicao-resultados-idade-progressiva/transicao-resultados-idade-progressiva.component';




@NgModule({
  imports: [
    CommonModule,
    transicaoResultadosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule,
    TooltipModule,
  ],
  declarations: [
    TransicaoResultadosComponent,
    TransicaoResultadosPontosComponent,
    TransicaoResultadosIdadeProgressivaComponent,
    TransicaoResultadosPedagio50Component,
    TransicaoResultadosPedagio100Component,
    TransicaoResultadosIdadeComponent,
    ]
})
export class TransicaoResultadosModule { }
