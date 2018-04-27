
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosNovoCalculoComponent} from "./beneficios-novo-calculo.component";

export const beneficiosNovoCalculoRoutes: Routes = [{
  path: '',
  component: BeneficiosNovoCalculoComponent
},
{
  path: ':id',
  component: BeneficiosNovoCalculoComponent
},{
  path: ':id/:id_calculo',
  component: BeneficiosNovoCalculoComponent
}];

export const beneficiosNovoCalculoRouting = RouterModule.forChild(beneficiosNovoCalculoRoutes);

