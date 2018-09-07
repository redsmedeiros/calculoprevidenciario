
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'rgps-segurados',
    loadChildren: 'app/+rgps/+rgps-segurados/rgps-segurados.module#RgpsSeguradosModule',
    data: {pageTitle: 'RGPS Segurados'}
  },
  { 
    path: 'rgps-elements',
    loadChildren: 'app/+rgps/+rgps-elements/rgps-elements.module#RgpsElementsModule',
    data: {pageTitle: 'RGPS'}
  },
  { 
    path: 'rgps-calculos',
    loadChildren: 'app/+rgps/+rgps-calculos/rgps-calculos.module#RgpsCalculosModule',
    data: {pageTitle: 'RGPS Calculo'}
  },
  { 
    path: 'rgps-valores-contribuidos',
    loadChildren: 'app/+rgps/+rgps-valores-contribuidos/rgps-valores-contribuidos.module#RgpsValoresContribuidosModule',
    data: {pageTitle: 'RGPS Valores Contribuidos'}
  },
  { 
    path: 'rgps-resultados',
    loadChildren: 'app/+rgps/+rgps-resultados/rgps-resultados.module#RgpsResultadosModule',
    data: {pageTitle: 'RGPS Resultados'}
  },
];

export const routing = RouterModule.forChild(routes);
