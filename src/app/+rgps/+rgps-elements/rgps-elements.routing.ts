
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsElementsComponent} from "./rgps-elements.component";

export const rgpsElementsRoutes: Routes = [{
  path: '',
  component: RgpsElementsComponent
}];

export const rgpsElementsRouting = RouterModule.forChild(rgpsElementsRoutes);

