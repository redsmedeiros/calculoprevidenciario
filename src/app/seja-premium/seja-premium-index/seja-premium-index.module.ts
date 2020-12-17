
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';

import { routingSejaPremiumIndex } from './seja-premium-index.routing';
import { SejaPremiumIndexComponent } from './seja-premium-index.component';

@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    SmartadminDatatableModule,
    routingSejaPremiumIndex
  ],
  declarations: [SejaPremiumIndexComponent]
})
export class SejaPremiumIndexModule { }
