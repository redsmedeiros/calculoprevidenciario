
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsValoresContribuidosComponent} from "./rgps-valores-contribuidos.component";

export const rgpsValoresContribuidosRoutes: Routes = [{
  path: ':id_segurado/:id',
  component: RgpsValoresContribuidosComponent
}];

export const rgpsValoresContribuidosRouting = RouterModule.forChild(rgpsValoresContribuidosRoutes);

