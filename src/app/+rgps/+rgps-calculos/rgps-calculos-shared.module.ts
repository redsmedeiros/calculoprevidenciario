
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { TextMaskModule } from 'angular2-text-mask';

import { RgpsCalculosCreateComponent } from './rgps-calculos-create/rgps-calculos-create.component';
import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy/rgps-calculos-destroy.component';
import { RgpsCalculosEditComponent } from './rgps-calculos-edit/rgps-calculos-edit.component';
import { RgpsCalculosFormComponent } from './rgps-calculos-form/rgps-calculos-form.component';
import { RgpsCalculosIndexComponent } from './rgps-calculos-index/rgps-calculos-index.component';
import { RgpsCalculosComponent } from './rgps-calculos.component';

import { I18nModule } from '../../shared/i18n/i18n.module';
import { WINDOW_PROVIDERS } from './window.service';
import { ModalModule } from 'ngx-bootstrap';

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
    SmartadminModule,
    TextMaskModule,
    I18nModule,
    SmartadminDatatableModule,
    CurrencyMaskModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    RgpsCalculosComponent,
    RgpsCalculosEditComponent,
    RgpsCalculosFormComponent,
    RgpsCalculosIndexComponent,
    RgpsCalculosDestroyComponent,
    RgpsCalculosCreateComponent
  ],
  exports: [
    ModalModule,
    RgpsCalculosComponent,
    RgpsCalculosEditComponent,
    RgpsCalculosFormComponent,
    RgpsCalculosIndexComponent,
    RgpsCalculosDestroyComponent,
    RgpsCalculosCreateComponent
  ],
  providers: [WINDOW_PROVIDERS,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
})
export class RgpsCalculosSharedModule { }
