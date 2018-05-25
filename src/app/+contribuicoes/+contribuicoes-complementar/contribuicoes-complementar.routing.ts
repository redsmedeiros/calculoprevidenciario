
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesComplementarComponent} from "./contribuicoes-complementar.component";
import { ContribuicoesComplementarDestroyComponent } from './contribuicoes-complementar-destroy/contribuicoes-complementar-destroy.component';

export const contribuicoesComplementarRoutes: Routes = [
{
  path: '',
  component: ContribuicoesComplementarComponent
},
{
    path: ':id/:id_calculo/destroy',
    component: ContribuicoesComplementarDestroyComponent
}];

export const contribuicoesComplementarRouting = RouterModule.forChild(contribuicoesComplementarRoutes);
