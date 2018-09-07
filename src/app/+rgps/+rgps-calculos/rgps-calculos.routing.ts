
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsCalculosComponent} from "./rgps-calculos.component";
import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy/rgps-calculos-destroy.component';
import { RgpsCalculosEditComponent } from './rgps-calculos-edit/rgps-calculos-edit.component';

export const rgpsCalculosRoutes: Routes = [
	{
  		path: '',
  		component: RgpsCalculosComponent
	},
	{
  		path: ':id',
  		component: RgpsCalculosComponent
	},
	{
    	path: ':id/:id_calculo/destroy',
    	component: RgpsCalculosDestroyComponent
  },
  {
      path: ':id/:id_calculo/edit',
      component: RgpsCalculosEditComponent
  }
  ];

export const rgpsCalculosRouting = RouterModule.forChild(rgpsCalculosRoutes);

