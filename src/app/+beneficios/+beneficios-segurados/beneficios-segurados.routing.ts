
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosSeguradosComponent} from './beneficios-segurados.component';
import { BeneficiosSeguradosDestroyComponent } from './beneficios-segurados-destroy/beneficios-segurados-destroy.component';
import { BeneficiosSeguradosIndexComponent } from './beneficios-segurados-index/beneficios-segurados-index.component';
import { BeneficiosSeguradosCreateComponent } from './beneficios-segurados-create/beneficios-segurados-create.component';
import { BeneficiosSeguradosEditComponent } from './beneficios-segurados-edit/beneficios-segurados-edit.component';

export const beneficiosSeguradosRoutes: Routes = [
  {
    path: '',
    component: BeneficiosSeguradosComponent,
  },
  {
    path: ':id/editar',
    component: BeneficiosSeguradosEditComponent
  },
  {
    path: ':id/destroy',
    component: BeneficiosSeguradosDestroyComponent
  },
];

export const beneficiosSeguradosRouting = RouterModule.forChild(beneficiosSeguradosRoutes);

