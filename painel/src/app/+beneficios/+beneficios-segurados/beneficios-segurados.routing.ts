
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosSeguradosComponent} from "./beneficios-segurados.component";

export const beneficiosSeguradosRoutes: Routes = [{
  path: '',
  component: BeneficiosSeguradosComponent
}];

export const beneficiosSeguradosRouting = RouterModule.forChild(beneficiosSeguradosRoutes);

