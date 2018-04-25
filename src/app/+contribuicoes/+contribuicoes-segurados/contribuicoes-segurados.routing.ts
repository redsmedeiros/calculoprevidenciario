
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import { ContribuicoesSeguradosComponent } from "./contribuicoes-segurados.component";
import { ContribuicoesSeguradosDestroyComponent } from './contribuicoes-segurados-destroy/contribuicoes-segurados-destroy.component';
import { ContribuicoesSeguradosIndexComponent } from './contribuicoes-segurados-index/contribuicoes-segurados-index.component';
import { ContribuicoesSeguradosCreateComponent } from './contribuicoes-segurados-create/contribuicoes-segurados-create.component';
import { ContribuicoesSeguradosEditComponent } from './contribuicoes-segurados-edit/contribuicoes-segurados-edit.component';

export const contribuicoesSeguradosRoutes: Routes = [
  {
    path: '',
    component: ContribuicoesSeguradosComponent,
  },
  {
    path: ':id/editar',
    component: ContribuicoesSeguradosEditComponent
  },
  {
    path: ':id/destroy',
    component: ContribuicoesSeguradosDestroyComponent
  },
];

export const contribuicoesSeguradosRouting = RouterModule.forChild(contribuicoesSeguradosRoutes);

