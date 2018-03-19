
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {BeneficiosNovoCalculoComponent} from "./beneficios-novo-calculo.component";

export const beneficiosNovoCalculoRoutes: Routes = [{
  path: '',
  component: BeneficiosNovoCalculoComponent
}];

export const beneficiosNovoCalculoRouting = RouterModule.forChild(beneficiosNovoCalculoRoutes);

