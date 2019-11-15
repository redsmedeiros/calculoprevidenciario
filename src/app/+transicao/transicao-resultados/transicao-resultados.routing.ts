

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransicaoResultadosComponent } from './transicao-resultados.component';

export const transicaoResultadosRoutes: Routes = [
  {
    path: '',
    component: TransicaoResultadosComponent,
  },
];

export const transicaoResultadosRouting = RouterModule.forChild(transicaoResultadosRoutes);
