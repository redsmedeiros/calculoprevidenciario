import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SejaPremiumRoutingModule } from './seja-premium-routing.module';
import { SejaPremiumIndexComponent } from './seja-premium-index/seja-premium-index.component';

@NgModule({
  imports: [
    CommonModule,
    SejaPremiumRoutingModule
  ],
  declarations: [SejaPremiumIndexComponent]
})
export class SejaPremiumModule { }
