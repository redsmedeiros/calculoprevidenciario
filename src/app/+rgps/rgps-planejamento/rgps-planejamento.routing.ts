
import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {RgpsPlanejamentoIndexComponent} from "./rgps-planejamento-index/rgps-planejamento-index.component";

export const rgpsPlanejamentoRoutes: Routes = [
	{
		path: ':id_segurado/:id',
		component: RgpsPlanejamentoIndexComponent
	},	
  ];

export const rgpsPlanejamentoRouting = RouterModule.forChild(rgpsPlanejamentoRoutes);
