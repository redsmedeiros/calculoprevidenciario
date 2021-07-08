
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { TextMaskModule } from 'angular2-text-mask';
import { MorrisGraphModule } from 'app/shared/graphs/morris-graph/morris-graph.module';


import { contagemTempoResultadosRouting } from './contagem-tempo-resultados.routing';
import { ContagemTempoResultadosComponent } from './contagem-tempo-resultados.component';
import { ContagemTempoConclusaoComponent } from './contagem-tempo-conclusao/contagem-tempo-conclusao.component';
import { ContagemTempoConclusaoPeriodosComponent } from './contagem-tempo-conclusao-periodos/contagem-tempo-conclusao-periodos.component';
import { ContagemTempoConclusaoGraphComponent } from './contagem-tempo-conclusao-graph/contagem-tempo-conclusao-graph.component';
import { ContagemTempoConclusaoSeguradoComponent } from './contagem-tempo-conclusao-segurado/contagem-tempo-conclusao-segurado.component';
import { ContagemTempoConclusaoExportarRgpsComponent } from './contagem-tempo-conclusao-exportar-rgps/contagem-tempo-conclusao-exportar-rgps.component';



@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    TextMaskModule,
    MorrisGraphModule,
    SmartadminDatatableModule,
    contagemTempoResultadosRouting
  ],
  declarations: [
    ContagemTempoResultadosComponent,
    ContagemTempoConclusaoComponent,
    ContagemTempoConclusaoPeriodosComponent,
    ContagemTempoConclusaoGraphComponent,
    ContagemTempoConclusaoSeguradoComponent,
    ContagemTempoConclusaoExportarRgpsComponent
  ],
  exports:[
    ContagemTempoResultadosComponent,
    ContagemTempoConclusaoComponent,
    ContagemTempoConclusaoPeriodosComponent,
    ContagemTempoConclusaoGraphComponent,
    ContagemTempoConclusaoSeguradoComponent,
    ContagemTempoConclusaoExportarRgpsComponent
  ]
})
export class ContagemTempoSharedResultadosModule { }
