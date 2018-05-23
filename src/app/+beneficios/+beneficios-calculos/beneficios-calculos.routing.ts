
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosCalculosComponent} from './beneficios-calculos.component';
import {BeneficiosCalculosDestroyComponent} from './beneficios-calculos-destroy/beneficios-calculos-destroy.component';
import {BeneficiosCalculosEditComponent} from './beneficios-calculos-edit/beneficios-calculos-edit.component';
import {BeneficiosCalculosCreateComponent} from './beneficios-calculos-create/beneficios-calculos-create.component';

export const beneficiosCalculosRoutes: Routes = [
{
  path: '',
  component: BeneficiosCalculosComponent
},
{
  path: ':id',
  component: BeneficiosCalculosComponent
},
{
    path: ':id/:id_calculo/destroy',
    component: BeneficiosCalculosDestroyComponent
},
{
    path: ':id/:id_calculo/edit',
    component: BeneficiosCalculosEditComponent
},
{
    path: ':type/:id',
    component: BeneficiosCalculosCreateComponent
}
];

export const beneficiosCalculosRouting = RouterModule.forChild(beneficiosCalculosRoutes);

