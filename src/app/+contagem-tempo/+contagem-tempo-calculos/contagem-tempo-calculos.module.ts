import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contagemTempoCalculosRouting } from './contagem-tempo-calculos.routing';
import { ContagemTempoCalculosComponent } from './contagem-tempo-calculos.component';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { ContagemTempoCalculosEditComponent } from './contagem-tempo-calculos-edit/contagem-tempo-calculos-edit.component';
import { ContagemTempoCalculosFormComponent } from './contagem-tempo-calculos-form/contagem-tempo-calculos-form.component';
import { ContagemTempoCalculosIndexComponent } from './contagem-tempo-calculos-index/contagem-tempo-calculos-index.component';
import { ContagemTempoCalculosDestroyComponent } from './contagem-tempo-calculos-destroy/contagem-tempo-calculos-destroy.component';
import { ContagemTempoCalculosCreateComponent } from './contagem-tempo-calculos-create/contagem-tempo-calculos-create.component';
import { I18nModule } from '../../shared/i18n/i18n.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    contagemTempoCalculosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule
  ],
  declarations: [
    ContagemTempoCalculosComponent,
    ContagemTempoCalculosEditComponent,
    ContagemTempoCalculosFormComponent,
    ContagemTempoCalculosIndexComponent,
    ContagemTempoCalculosDestroyComponent,
    ContagemTempoCalculosCreateComponent
  ]
})
export class ContagemTempoCalculosModule { }
