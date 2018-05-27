import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesResultadosComplementarComponent} from "./contribuicoes-resultados-complementar.component";

export const contribuicoesResultadosComplementarRoutes: Routes = [
{
  path: '',
  component: ContribuicoesResultadosComplementarComponent
},
{
  path: ':id_calculo',
  component: ContribuicoesResultadosComplementarComponent
}];

export const contribuicoesResultadosComplementarRouting = RouterModule.forChild(contribuicoesResultadosComplementarRoutes);

