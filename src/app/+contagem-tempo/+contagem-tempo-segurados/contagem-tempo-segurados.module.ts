
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';

import { contagemTempoSeguradosRouting } from './contagem-tempo-segurados.routing';
import { SharedContagemTempoSeguradosModule } from './../shared-contagem-tempo/shared-contagem-tempo-segurados.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';


@NgModule({
  imports: [
    CommonModule,
    contagemTempoSeguradosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule,
    TooltipModule,
    SharedContagemTempoSeguradosModule
  ],
  declarations: [
    // ContagemTempoSeguradosComponent,
    // ContagemTempoSeguradosIndexComponent,
    // ContagemTempoSeguradosCreateComponent,
    // ContagemTempoSeguradosDestroyComponent,
    // ContagemTempoSeguradosFormComponent,
    // ContagemTempoSeguradosEditComponent
  ]
})
export class ContagemTempoSeguradosModule { }
