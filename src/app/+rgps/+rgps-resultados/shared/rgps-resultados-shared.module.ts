import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from 'app/shared/smartadmin.module';
import { SmartadminDatatableModule } from 'app/shared/ui/datatable/smartadmin-datatable.module';

import { AccordionModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

import { WINDOW_PROVIDERS } from 'app/+rgps/+rgps-calculos/window.service';
import { RgpsPlanejamentoCalculoComponent } from 'app/+rgps/rgps-planejamento-calculo/rgps-planejamento-calculo.component';
import { RgpsPlanejamentoIndexComponent } from 'app/+rgps/rgps-planejamento/rgps-planejamento-index/rgps-planejamento-index.component';
import { RgpsResultadosAnterior88Component } from '../rgps-resultados-anterior88/rgps-resultados-anterior88.component';
import { ListaCompetenciasComponent } from '../rgps-resultados-apos-pec103/calculoMedia/lista-competencias/lista-competencias.component';
import { ConclusoesRmiComponent } from '../rgps-resultados-apos-pec103/conclusoes/conclusoes-rmi/conclusoes-rmi.component';
import { RgpsResultadosAposPec103Component } from '../rgps-resultados-apos-pec103/rgps-resultados-apos-pec103.component';
import { RgpsResultadosApos99Component } from '../rgps-resultados-apos99/rgps-resultados-apos99.component';
import { RgpsResultadosEntre88e91Component } from '../rgps-resultados-entre88e91/rgps-resultados-entre88e91.component';
import { RgpsResultadosEntre91e98Component } from '../rgps-resultados-entre91e98/rgps-resultados-entre91e98.component';
import { RgpsResultadosComponent } from '../rgps-resultados.component';




export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
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
    TextMaskModule,
    CurrencyMaskModule,
    SmartadminDatatableModule,
    AccordionModule.forRoot(),
  ],
  providers: [WINDOW_PROVIDERS,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  declarations: [
    RgpsResultadosComponent,
    RgpsResultadosAnterior88Component,
    RgpsResultadosEntre91e98Component,
    RgpsResultadosApos99Component,
    RgpsResultadosEntre88e91Component,
    // RgpsResultadosAposPec062019Component,
    RgpsResultadosAposPec103Component,
    ListaCompetenciasComponent,
    ConclusoesRmiComponent,
    RgpsPlanejamentoCalculoComponent,
    RgpsPlanejamentoIndexComponent
  ],
  exports: [
    RgpsResultadosComponent,
    RgpsResultadosAnterior88Component,
    RgpsResultadosEntre91e98Component,
    RgpsResultadosApos99Component,
    RgpsResultadosEntre88e91Component,
    RgpsResultadosAposPec103Component,
    ListaCompetenciasComponent,
    ConclusoesRmiComponent,
    RgpsPlanejamentoCalculoComponent,
    RgpsPlanejamentoIndexComponent
  ]
})
export class RgpsResultadosSharedModule { }
