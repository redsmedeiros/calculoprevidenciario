
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './logout.component';

export const logoutRoutes: Routes = [{
  path: '',
  component: LogoutComponent
}];

export const logoutRouting = RouterModule.forChild(logoutRoutes);

