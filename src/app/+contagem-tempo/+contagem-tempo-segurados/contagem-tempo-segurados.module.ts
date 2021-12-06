

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';

import { contagemTempoSeguradosRouting } from './contagem-tempo-segurados.routing';

import { ContagemTempoSeguradosComponent } from './contagem-tempo-segurados.component';
import { ContagemTempoSeguradosIndexComponent } from './contagem-tempo-segurados-index/contagem-tempo-segurados-index.component';
import { ContagemTempoSeguradosCreateComponent } from './contagem-tempo-segurados-create/contagem-tempo-segurados-create.component';
import { ContagemTempoSeguradosEditComponent } from './contagem-tempo-segurados-edit/contagem-tempo-segurados-edit.component';
import { ContagemTempoSeguradosFormComponent } from './contagem-tempo-segurados-form/contagem-tempo-segurados-form.component';
import { ContagemTempoSeguradosDestroyComponent } from './contagem-tempo-segurados-destroy/contagem-tempo-segurados-destroy.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';



@NgModule({
  imports: [
    CommonModule,
    contagemTempoSeguradosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule,
    TooltipModule
  ],
  declarations: [
    ContagemTempoSeguradosComponent,
    ContagemTempoSeguradosIndexComponent,
    ContagemTempoSeguradosCreateComponent,
    ContagemTempoSeguradosDestroyComponent,
    ContagemTempoSeguradosFormComponent,
    ContagemTempoSeguradosEditComponent
  ], exports: [
    ContagemTempoSeguradosComponent,
    ContagemTempoSeguradosCreateComponent,
    ContagemTempoSeguradosDestroyComponent,
    ContagemTempoSeguradosFormComponent,
    ContagemTempoSeguradosEditComponent
  ]
})
export class ContagemTempoSeguradosModule { }
