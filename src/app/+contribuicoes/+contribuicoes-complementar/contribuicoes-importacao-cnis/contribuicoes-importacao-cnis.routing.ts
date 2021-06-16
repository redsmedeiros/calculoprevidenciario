
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesImportacaoCnisComponent} from "./contribuicoes-importacao-cnis.component";

export const contribuicoesImportacaoCnisRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: ContribuicoesImportacaoCnisComponent
}];

export const ContribuicoesImportacaoCnisRouting = RouterModule.forChild(contribuicoesImportacaoCnisRoutes);

