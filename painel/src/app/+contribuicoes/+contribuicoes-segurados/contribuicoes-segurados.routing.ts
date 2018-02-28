
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {ContribuicoesSeguradosComponent} from "./contribuicoes-segurados.component";

export const contribuicoesSeguradosRoutes: Routes = [{
  path: '',
  component: ContribuicoesSeguradosComponent
}];

export const contribuicoesSeguradosRouting = RouterModule.forChild(contribuicoesSeguradosRoutes);

