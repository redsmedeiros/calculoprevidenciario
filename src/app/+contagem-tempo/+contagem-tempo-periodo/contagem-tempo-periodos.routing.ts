
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import { ContagemTempoPeriodoComponent } from './contagem-tempo-periodo.component';

export const contagemTempoPeriodosContribuidosRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: ContagemTempoPeriodoComponent
}];

export const contagemTempoPeriodosContribuidosRouting = RouterModule.forChild(contagemTempoPeriodosContribuidosRoutes);

