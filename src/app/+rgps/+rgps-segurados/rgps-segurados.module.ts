import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsSeguradosRouting } from './rgps-segurados.routing';
import {RgpsSeguradosComponent} from './rgps-segurados.component';
import {SmartadminModule} from '../../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../../shared/ui/datatable/smartadmin-datatable.module';
import { RgpsSeguradosIndexComponent } from './rgps-segurados-index/rgps-segurados-index.component';
import { RgpsSeguradosCreateComponent } from './rgps-segurados-create/rgps-segurados-create.component';
import { RgpsSeguradosDestroyComponent } from './rgps-segurados-destroy/rgps-segurados-destroy.component';
import { RgpsSeguradosFormComponent } from './rgps-segurados-form/rgps-segurados-form.component';
import { RgpsSeguradosEditComponent } from './rgps-segurados-edit/rgps-segurados-edit.component';
import {I18nModule} from "../../shared/i18n/i18n.module";
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  imports: [
    CommonModule,
    rgpsSeguradosRouting,
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule
  ],
  declarations: [RgpsSeguradosComponent, RgpsSeguradosIndexComponent, RgpsSeguradosCreateComponent, RgpsSeguradosDestroyComponent, RgpsSeguradosFormComponent, RgpsSeguradosEditComponent]
})
export class RgpsSeguradosModule { }
