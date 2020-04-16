
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsResultadosComponent} from "./rgps-resultados.component";

export const rgpsResultadosRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: RgpsResultadosComponent
},
{
  path: ':id_segurado/:id/:pbc',
  component: RgpsResultadosComponent
},
{
  path: ':id_segurado/:id/:pbc/:correcao_pbc',
  component: RgpsResultadosComponent
}];

export const rgpsResultadosRouting = RouterModule.forChild(rgpsResultadosRoutes);

