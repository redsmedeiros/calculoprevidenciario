import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/+transicao/transicao-form/transicao-form.module#TransicaoFormModule',
    data: {pageTitle: 'Informações - Transição EC nº 103/2019'}
  },
  // {
  //   path: 'resultados',
  //   loadChildren: 'app/+transicao/transicao-resultados/transicao-resultados.module#TransicaoResultadosModule',
  //   data: {pageTitle: 'Resultados Transição EC nº 103/2019'}
  // },
];

export const routing = RouterModule.forChild(routes);
