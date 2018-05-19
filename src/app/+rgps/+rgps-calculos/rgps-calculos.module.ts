import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsCalculosRouting } from './rgps-calculos.routing';
import {RgpsCalculosComponent} from "./rgps-calculos.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";
import { RgpsCalculosEditComponent } from './rgps-calculos-edit/rgps-calculos-edit.component';
import { RgpsCalculosFormComponent } from './rgps-calculos-form/rgps-calculos-form.component';
import { RgpsCalculosIndexComponent } from './rgps-calculos-index/rgps-calculos-index.component';
import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy/rgps-calculos-destroy.component';
import { RgpsCalculosCreateComponent } from './rgps-calculos-create/rgps-calculos-create.component';
import {I18nModule} from "../../shared/i18n/i18n.module";
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    rgpsCalculosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsCalculosComponent, RgpsCalculosEditComponent, RgpsCalculosFormComponent, RgpsCalculosIndexComponent, RgpsCalculosDestroyComponent, RgpsCalculosCreateComponent]
})
export class RgpsCalculosModule { }
