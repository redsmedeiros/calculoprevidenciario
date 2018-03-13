
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsMatrizComponent} from "./rgps-matriz.component";

export const rgpsMatrizRoutes: Routes = [{
  path: '',
  component: RgpsMatrizComponent
}];

export const rgpsMatrizRouting = RouterModule.forChild(rgpsMatrizRoutes);

