
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesCalculosComponent} from "./contribuicoes-calculos.component";

export const contribuicoesCalculosRoutes: Routes = [{
  path: '',
  component: ContribuicoesCalculosComponent
},
{
  path: ':id',
  component: ContribuicoesCalculosComponent
}];

export const contribuicoesCalculosRouting = RouterModule.forChild(contribuicoesCalculosRoutes);

