import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { RgpsPlanejamentoCalculosPlanejadosComponent } from './rgps-planejamento-calculos-planejados/rgps-planejamento-calculos-planejados.component';
import { RgpsPlanejamentoIndexComponent } from './rgps-planejamento-index/rgps-planejamento-index.component';
import { RgpsPlanejamentoSeguradosComponent } from './rgps-planejamento-segurados/rgps-planejamento-segurados.component';

export const rgpsPlanejamentoRoutes: Routes = [
	{
		path: '',
		component: RgpsPlanejamentoSeguradosComponent
	},
	{
		path: ':id_segurado/:id',
		component: RgpsPlanejamentoIndexComponent
	},
	{
		path: 'planejados/:id_segurado/:id',
		component: RgpsPlanejamentoCalculosPlanejadosComponent
	},
];

export const rgpsPlanejamentoRouting = RouterModule.forChild(rgpsPlanejamentoRoutes);
