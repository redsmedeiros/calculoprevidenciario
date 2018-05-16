
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesCalculosComponent} from "./contribuicoes-calculos.component";
import { ContribuicoesCalculosDestroyComponent } from './contribuicoes-calculos-destroy/contribuicoes-calculos-destroy.component';

export const contribuicoesCalculosRoutes: Routes = [{
  path: '',
  component: ContribuicoesCalculosComponent
},
{
  path: ':id',
  component: ContribuicoesCalculosComponent
},
{
    path: ':id/:id_calculo/destroy',
    component: ContribuicoesCalculosDestroyComponent
}];

export const contribuicoesCalculosRouting = RouterModule.forChild(contribuicoesCalculosRoutes);

