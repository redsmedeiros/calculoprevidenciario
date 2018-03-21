
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosCalculosComponent} from './beneficios-calculos.component';

export const beneficiosCalculosRoutes: Routes = [{
  path: '',
  component: BeneficiosCalculosComponent
}];

export const beneficiosCalculosRouting = RouterModule.forChild(beneficiosCalculosRoutes);

