
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsCalculosComponent} from "./rgps-calculos.component";
import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy/rgps-calculos-destroy.component';

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
  	}
  ];

export const rgpsCalculosRouting = RouterModule.forChild(rgpsCalculosRoutes);

