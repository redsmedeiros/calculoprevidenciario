
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  { 
    path: 'contribuicoes-segurados',
    loadChildren: 'app/+contribuicoes/+contribuicoes-segurados/contribuicoes-segurados.module#ContribuicoesSeguradosModule',
    data: {pageTitle: 'Contribuicoes Segurados'}
  },
  { 
    path: 'contribuicoes-calculos',
    loadChildren: 'app/+contribuicoes/+contribuicoes-calculos/contribuicoes-calculos.module#ContribuicoesCalculosModule',
    data: {pageTitle: 'Contribuicoes Calculo'}
  },
];

export const routing = RouterModule.forChild(routes);
