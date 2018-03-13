
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsCalculosComponent} from "./rgps-calculos.component";

export const rgpsCalculosRoutes: Routes = [{
  path: '',
  component: RgpsCalculosComponent
}];

export const rgpsCalculosRouting = RouterModule.forChild(rgpsCalculosRoutes);

