
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesJurisprudencialComponent} from "./contribuicoes-jurisprudencial.component";

export const contribuicoesJurisprudencialRoutes: Routes = [{
  path: '',
  component: ContribuicoesJurisprudencialComponent
},{
  path: ':id_calculo',
  component: ContribuicoesJurisprudencialComponent
}];

export const contribuicoesJurisprudencialRouting = RouterModule.forChild(contribuicoesJurisprudencialRoutes);
