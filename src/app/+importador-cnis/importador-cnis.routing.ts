

import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import { ImportadorCnisComponent } from './importador-cnis.component';
import { ImportadorHomeComponent } from './importador-home/importador-home.component';


export const importadorCnisRoutes: Routes = [{
  path: '',
  component: ImportadorCnisComponent
},
{
  path: 'home',
  component: ImportadorHomeComponent
}];

export const importadorCnisRouting = RouterModule.forChild(importadorCnisRoutes);

