
import {ModuleWithProviders} from '@angular/core'
import {RouterModule, Routes} from '@angular/router';


export const routes: Routes = [
  {
    path: 'contagem-tempo-segurados',
    loadChildren: 'app/+contagem-tempo/+contagem-tempo-segurados/contagem-tempo-segurados.module#ContagemTempoSeguradosModule',
    data: {pageTitle: 'Contagem Tempo Segurados'}
  },
  {
    path: 'contagem-tempo-calculos',
    loadChildren: 'app/+contagem-tempo/+contagem-tempo-calculos/contagem-tempo-calculos.module#ContagemTempoCalculosModule',
    data: {pageTitle: 'Contagem Tempo  Calculo'}
  },
  {
    path: 'contagem-tempo-periodos',
    loadChildren: 'app/+contagem-tempo/+contagem-tempo-periodos/contagem-tempo-periodos.module#ContagemTempoPeriodosModule',
    data: {pageTitle: 'Contagem Tempo Períodos de Contribuíção'}
  },
  {
    path: 'contagem-tempo-resultados',
    loadChildren: 'app/+contagem-tempo/+contagem-tempo-resultados/contagem-tempo-resultados.module#ContagemTempoResultadosModule',
    data: {pageTitle: 'Contagem Tempo  Resultados'}
  },
];

export const routing = RouterModule.forChild(routes);