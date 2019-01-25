import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import { ContagemTempoResultadosComponent } from './contagem-tempo-resultados.component';

export const contagemTempoResultadosRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: ContagemTempoResultadosComponent
}];

export const contagemTempoResultadosRouting = RouterModule.forChild(contagemTempoResultadosRoutes);