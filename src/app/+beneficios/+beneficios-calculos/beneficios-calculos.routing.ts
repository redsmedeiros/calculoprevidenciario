
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosCalculosComponent} from './beneficios-calculos.component';
import {BeneficiosCalculosDestroyComponent} from './beneficios-calculos-destroy/beneficios-calculos-destroy.component';

export const beneficiosCalculosRoutes: Routes = [{
  path: '',
  component: BeneficiosCalculosComponent
},{
  path: ':id',
  component: BeneficiosCalculosComponent
},{
    path: ':id/:id_calculo/destroy',
    component: BeneficiosCalculosDestroyComponent
}
];

export const beneficiosCalculosRouting = RouterModule.forChild(beneficiosCalculosRoutes);

