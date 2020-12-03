import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';
import { WINDOW_PROVIDERS } from '../+rgps-calculos/window.service';
import { ModalModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { rgpsPlanejamentoRouting } from '../rgps-planejamento/rgps-planejamento.routing';

// import { RgpsPlanejamentoIndexComponent } from './rgps-planejamento-index/rgps-planejamento-index.component';
import { RgpsPlanejamentoSeguradosComponent } from './rgps-planejamento-segurados/rgps-planejamento-segurados.component';
import { RgpsPlanejamentoCalculosPlanejadosComponent } from './rgps-planejamento-calculos-planejados/rgps-planejamento-calculos-planejados.component';
import { RgpsPlanejamentoSeguradosListComponent } from './rgps-planejamento-segurados/rgps-planejamento-segurados-list/rgps-planejamento-segurados-list.component';
import { RgpsPlanejamentoResultadosComponent } from './rgps-planejamento-resultados/rgps-planejamento-resultados.component';
import { RgpsPlanejamentoListComponent } from './rgps-planejamento-list/rgps-planejamento-list.component';
import { RgpsPlanejamentoCalculoFuturoComponent } from './rgps-planejamento-calculo-futuro/rgps-planejamento-calculo-futuro.component';

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
    rgpsPlanejamentoRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule,
    CurrencyMaskModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  providers: [WINDOW_PROVIDERS,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  declarations: [
    //RgpsPlanejamentoIndexComponent,
    RgpsPlanejamentoSeguradosComponent,
    RgpsPlanejamentoCalculosPlanejadosComponent,
    RgpsPlanejamentoSeguradosListComponent,
    RgpsPlanejamentoResultadosComponent,
    RgpsPlanejamentoListComponent,
    RgpsPlanejamentoCalculoFuturoComponent,
  ],
  exports: [
    ModalModule
  ]
})
export class RgpsPlanejamentoModule { }
