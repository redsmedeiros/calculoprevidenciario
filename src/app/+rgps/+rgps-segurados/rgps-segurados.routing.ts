
import {ModuleWithProviders} from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import {RgpsSeguradosComponent} from './rgps-segurados.component';
import { RgpsSeguradosIndexComponent } from './rgps-segurados-index/rgps-segurados-index.component';
import { RgpsSeguradosCreateComponent } from './rgps-segurados-create/rgps-segurados-create.component';
import { RgpsSeguradosDestroyComponent } from './rgps-segurados-destroy/rgps-segurados-destroy.component';
import { RgpsSeguradosEditComponent } from './rgps-segurados-edit/rgps-segurados-edit.component';

export const rgpsSeguradosRoutes: Routes = [
  {
    path: '',
    component: RgpsSeguradosComponent,
  },
  {
    path: ':id/editar',
    component: RgpsSeguradosEditComponent
  },
  {
    path: ':id/destroy',
    component: RgpsSeguradosDestroyComponent
  },
];

export const rgpsSeguradosRouting = RouterModule.forChild(rgpsSeguradosRoutes);

