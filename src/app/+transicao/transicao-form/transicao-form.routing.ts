
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransicaoFormComponent } from './transicao-form.component';

export const transicaoFormRoutes: Routes = [
  {
    path: '',
    component: TransicaoFormComponent,
  },
];

export const transicaoFormRouting = RouterModule.forChild(transicaoFormRoutes);
