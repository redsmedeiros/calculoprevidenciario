
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import { ContagemTempoPeriodosComponent } from './contagem-tempo-periodos.component';

export const contagemTempoPeriodosRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: ContagemTempoPeriodosComponent
}];

export const contagemTempoPeriodosRouting = RouterModule.forChild(contagemTempoPeriodosRoutes);

