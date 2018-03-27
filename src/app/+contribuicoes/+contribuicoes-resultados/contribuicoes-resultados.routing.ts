
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesResultadosComponent} from "./contribuicoes-resultados.component";

export const contribuicoesResultadosRoutes: Routes = [{
  path: '',
  component: ContribuicoesResultadosComponent
}];

export const contribuicoesResultadosRouting = RouterModule.forChild(contribuicoesResultadosRoutes);

