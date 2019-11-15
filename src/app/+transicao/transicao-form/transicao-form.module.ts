

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';


import { transicaoFormRouting } from './transicao-form.routing';

import { TransicaoFormComponent } from './transicao-form.component';
import { TransicaoResultadosComponent } from './../transicao-resultados/transicao-resultados.component';
import { TransicaoResultadosPontosComponent } from '../transicao-resultados/transicao-resultados-pontos/transicao-resultados-pontos.component';
import { TransicaoResultadosIdadeProgressivaComponent } from '../transicao-resultados/transicao-resultados-idade-progressiva/transicao-resultados-idade-progressiva.component';
import { TransicaoResultadosPedagio50Component } from '../transicao-resultados/transicao-resultados-pedagio50/transicao-resultados-pedagio50.component';
import { TransicaoResultadosPedagio100Component } from '../transicao-resultados/transicao-resultados-pedagio100/transicao-resultados-pedagio100.component';
import { TransicaoResultadosIdadeComponent } from '../transicao-resultados/transicao-resultados-idade/transicao-resultados-idade.component';

@NgModule({
  imports: [
    CommonModule,
    transicaoFormRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule,
    TooltipModule
  ],
  declarations: [
    TransicaoFormComponent,
    TransicaoResultadosComponent,
    TransicaoResultadosPontosComponent,
    TransicaoResultadosIdadeProgressivaComponent,
    TransicaoResultadosPedagio50Component,
    TransicaoResultadosPedagio100Component,
    TransicaoResultadosIdadeComponent]
})
export class TransicaoFormModule { }
