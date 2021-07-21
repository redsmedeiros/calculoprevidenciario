import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsResultadosRouting } from './rgps-resultados.routing';
import { RgpsResultadosComponent } from './rgps-resultados.component';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { RgpsResultadosAnterior88Component } from './rgps-resultados-anterior88/rgps-resultados-anterior88.component';
import { RgpsResultadosEntre91e98Component } from './rgps-resultados-entre91e98/rgps-resultados-entre91e98.component';
import { RgpsResultadosApos99Component } from './rgps-resultados-apos99/rgps-resultados-apos99.component';
import { RgpsResultadosEntre88e91Component } from './rgps-resultados-entre88e91/rgps-resultados-entre88e91.component';
import { WINDOW_PROVIDERS } from '../+rgps-calculos/window.service';
import { AccordionModule } from 'ngx-bootstrap';
import { RgpsResultadosAposPec062019Component } from './rgps-resultados-apos-pec062019/rgps-resultados-apos-pec062019.component';
import { RgpsResultadosAposPec103Component } from './rgps-resultados-apos-pec103/rgps-resultados-apos-pec103.component';
import { ListaCompetenciasComponent } from './rgps-resultados-apos-pec103/calculoMedia/lista-competencias/lista-competencias.component';
import { ConclusoesRmiComponent } from './rgps-resultados-apos-pec103/conclusoes/conclusoes-rmi/conclusoes-rmi.component';
import { RgpsPlanejamentoIndexComponent } from '../rgps-planejamento/rgps-planejamento-index/rgps-planejamento-index.component';
import { RgpsPlanejamentoCalculoComponent } from '../rgps-planejamento-calculo/rgps-planejamento-calculo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';



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
    rgpsResultadosRouting,
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
export class RgpsResultadosModule { }
