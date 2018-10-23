
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsImportacaoCnisComponent} from "./rgps-importacao-cnis.component";

export const rgpsImportacaoCnisRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: RgpsImportacaoCnisComponent
}];

export const rgpsImportacaoCnisRouting = RouterModule.forChild(rgpsImportacaoCnisRoutes);

