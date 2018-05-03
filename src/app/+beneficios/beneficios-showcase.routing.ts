
import {ModuleWithProviders} from '@angular/core'
import {RouterModule, Routes} from '@angular/router';


export const routes: Routes = [
  {
    path: 'beneficios-segurados',
    loadChildren: 'app/+beneficios/+beneficios-segurados/beneficios-segurados.module#BeneficiosSeguradosModule',
    data: {pageTitle: 'Beneficios'}
  },
  {
    path: 'beneficios-calculos',
    loadChildren: 'app/+beneficios/+beneficios-calculos/beneficios-calculos.module#BeneficiosCalculosModule',
    data: {pageTitle: 'Beneficios Calculo'}
  },
  {
    path: 'novo-calculo',
    loadChildren: 'app/+beneficios/+beneficios-novo-calculo/beneficios-novo-calculo.module#BeneficiosNovoCalculoModule',
    data: {pageTitle: 'Novo Calculo'}
  },
];

export const routing = RouterModule.forChild(routes);
