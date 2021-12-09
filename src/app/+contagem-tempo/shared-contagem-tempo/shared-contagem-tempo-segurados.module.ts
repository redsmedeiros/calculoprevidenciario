

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';

import { ContagemTempoSeguradosCreateComponent } from '../+contagem-tempo-segurados/contagem-tempo-segurados-create/contagem-tempo-segurados-create.component';
import { ContagemTempoSeguradosDestroyComponent } from '../+contagem-tempo-segurados/contagem-tempo-segurados-destroy/contagem-tempo-segurados-destroy.component';
import { ContagemTempoSeguradosEditComponent } from '../+contagem-tempo-segurados/contagem-tempo-segurados-edit/contagem-tempo-segurados-edit.component';
import { ContagemTempoSeguradosFormComponent } from '../+contagem-tempo-segurados/contagem-tempo-segurados-form/contagem-tempo-segurados-form.component';
import { ContagemTempoSeguradosIndexComponent } from '../+contagem-tempo-segurados/contagem-tempo-segurados-index/contagem-tempo-segurados-index.component';
import { ContagemTempoSeguradosComponent } from '../+contagem-tempo-segurados/contagem-tempo-segurados.component';






@NgModule({
  imports: [
    CommonModule,
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
export class SharedContagemTempoSeguradosModule { }
