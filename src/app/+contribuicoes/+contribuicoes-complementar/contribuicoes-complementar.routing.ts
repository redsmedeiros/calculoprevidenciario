
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesComplementarComponent} from "./contribuicoes-complementar.component";

export const contribuicoesComplementarRoutes: Routes = [{
  path: '',
  component: ContribuicoesComplementarComponent
}];

export const contribuicoesComplementarRouting = RouterModule.forChild(contribuicoesComplementarRoutes);
