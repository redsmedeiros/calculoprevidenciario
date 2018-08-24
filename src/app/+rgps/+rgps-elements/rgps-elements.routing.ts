
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsElementsComponent} from "./rgps-elements.component";

export const rgpsElementsRoutes: Routes = [{
  path: ':id_segurado/:id_calculo1/:id_calculo2',
  component: RgpsElementsComponent
}];

export const rgpsElementsRouting = RouterModule.forChild(rgpsElementsRoutes);

