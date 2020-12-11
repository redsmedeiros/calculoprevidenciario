import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/+transicao/transicao-form/transicao-form.module#TransicaoFormModule',
    data: {pageTitle: 'Seja Premium'}
  },
];

export const routing = RouterModule.forChild(routes);
