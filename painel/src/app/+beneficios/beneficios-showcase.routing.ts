
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
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
];

export const routing = RouterModule.forChild(routes);
