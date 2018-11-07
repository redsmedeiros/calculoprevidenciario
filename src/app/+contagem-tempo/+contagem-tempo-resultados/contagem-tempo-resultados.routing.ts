
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import { ContagemTempoResultadosComponent } from './+contagem-tempo-resultados.component';

export const ContagemTempoResultadosRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: ContagemTempoResultadosComponent
}];

export const ContagemTempoResultadosRouting = RouterModule.forChild(ContagemTempoResultadosRoutes);