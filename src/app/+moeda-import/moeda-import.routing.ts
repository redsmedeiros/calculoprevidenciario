
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {MoedaImportComponent} from "./moeda-import.component";

export const moedaImportRoutes: Routes = [{
  path: '',
  component: MoedaImportComponent
}];

export const moedaImportRouting = RouterModule.forChild(moedaImportRoutes);

