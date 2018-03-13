
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsResultadosComponent} from "./rgps-resultados.component";

export const rgpsResultadosRoutes: Routes = [{
  path: '',
  component: RgpsResultadosComponent
}];

export const rgpsResultadosRouting = RouterModule.forChild(rgpsResultadosRoutes);

