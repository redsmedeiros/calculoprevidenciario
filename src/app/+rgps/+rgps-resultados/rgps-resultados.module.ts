import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rgpsResultadosRouting } from './rgps-resultados.routing';
import { RgpsResultadosComponent } from './rgps-resultados.component';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { RgpsResultadosAnterior88Component } from './rgps-resultados-anterior88/rgps-resultados-anterior88.component';
import { RgpsResultadosEntre91e98Component } from './rgps-resultados-entre91e98/rgps-resultados-entre91e98.component';
import { RgpsResultadosApos99Component } from './rgps-resultados-apos99/rgps-resultados-apos99.component';
import { RgpsResultadosEntre88e91Component } from './rgps-resultados-entre88e91/rgps-resultados-entre88e91.component';
import { WINDOW_PROVIDERS } from '../+rgps-calculos/window.service';
import { RgpsResultadosAposPec062019Component } from './rgps-resultados-apos-pec062019/rgps-resultados-apos-pec062019.component';
import { RgpsResultadosAposPec103Component } from './rgps-resultados-apos-pec103/rgps-resultados-apos-pec103.component';

@NgModule({
  imports: [
    CommonModule,
    rgpsResultadosRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  providers: [WINDOW_PROVIDERS],
  declarations: [RgpsResultadosComponent,
                RgpsResultadosAnterior88Component,
                RgpsResultadosEntre91e98Component,
                RgpsResultadosApos99Component,
                RgpsResultadosEntre88e91Component,
                RgpsResultadosAposPec062019Component,
                RgpsResultadosAposPec103Component]
})
export class RgpsResultadosModule { }
