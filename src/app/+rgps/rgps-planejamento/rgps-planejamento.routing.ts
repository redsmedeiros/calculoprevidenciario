import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { RgpsPlanejamentoCalculosPlanejadosComponent } from './rgps-planejamento-calculos-planejados/rgps-planejamento-calculos-planejados.component';
import { RgpsPlanejamentoResultadosComponent } from './rgps-planejamento-resultados/rgps-planejamento-resultados.component';
//import { RgpsPlanejamentoIndexComponent } from './rgps-planejamento-index/rgps-planejamento-index.component';
import { RgpsPlanejamentoSeguradosComponent } from './rgps-planejamento-segurados/rgps-planejamento-segurados.component';

export const rgpsPlanejamentoRoutes: Routes = [
	{
		path: '',
		component: RgpsPlanejamentoSeguradosComponent
	},
	{
		path: 'planejados/:id_segurado/:id',
		component: RgpsPlanejamentoCalculosPlanejadosComponent
	},
	{
		path: 'resultados/:id_segurado/:id_calculo/:id_planejamento',
		component: RgpsPlanejamentoResultadosComponent
	},
];

export const rgpsPlanejamentoRouting = RouterModule.forChild(rgpsPlanejamentoRoutes);
