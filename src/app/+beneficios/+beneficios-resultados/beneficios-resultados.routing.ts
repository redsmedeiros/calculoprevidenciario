
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosResultadosComponent} from "./beneficios-resultados.component";

export const beneficiosResultadosRoutes: Routes = [{
  path: '',
  component: BeneficiosResultadosComponent
},
{
  path: ':id/:id_calculo',
  component: BeneficiosResultadosComponent
}];

export const beneficiosResultadosRouting = RouterModule.forChild(beneficiosResultadosRoutes);

