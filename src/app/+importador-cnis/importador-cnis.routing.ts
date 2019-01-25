

import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import { ImportadorCnisComponent } from './importador-cnis.component';


export const importadorCnisRoutes: Routes = [{
  path: '',
  component: ImportadorCnisComponent
}];

export const importadorCnisRouting = RouterModule.forChild(importadorCnisRoutes);

