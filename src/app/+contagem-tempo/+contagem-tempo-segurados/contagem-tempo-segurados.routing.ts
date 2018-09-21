

import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { ContagemTempoSeguradosComponent } from './contagem-tempo-segurados.component';
import { ContagemTempoSeguradosIndexComponent } from './contagem-tempo-segurados-index/contagem-tempo-segurados-index.component';
import { ContagemTempoSeguradosCreateComponent } from './contagem-tempo-segurados-create/contagem-tempo-segurados-create.component';
import { ContagemTempoSeguradosDestroyComponent } from './contagem-tempo-segurados-destroy/contagem-tempo-segurados-destroy.component';
import { ContagemTempoSeguradosEditComponent } from './contagem-tempo-segurados-edit/contagem-tempo-segurados-edit.component';

export const contagemTempoSeguradosRoutes: Routes = [
  {
    path: '',
    component: ContagemTempoSeguradosComponent,
  },
  {
    path: ':id/editar',
    component: ContagemTempoSeguradosEditComponent
  },
  {
    path: ':id/destroy',
    component: ContagemTempoSeguradosDestroyComponent
  },
];

export const contagemTempoSeguradosRouting = RouterModule.forChild(contagemTempoSeguradosRoutes);

