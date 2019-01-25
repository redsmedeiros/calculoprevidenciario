

import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import { ContagemTempoCalculosComponent } from './contagem-tempo-calculos.component';
import { ContagemTempoCalculosDestroyComponent } from './contagem-tempo-calculos-destroy/contagem-tempo-calculos-destroy.component';
import { ContagemTempoCalculosEditComponent } from './contagem-tempo-calculos-edit/contagem-tempo-calculos-edit.component';

export const contagemTempoCalculosRoutes: Routes = [
	{
		path: '',
		component: ContagemTempoCalculosComponent
	},
	{
		path: ':id',
		component: ContagemTempoCalculosComponent
	},
	{
		path: ':id/:id_calculo/destroy',
		component: ContagemTempoCalculosDestroyComponent
	},
	{
		path: ':id/:id_calculo/editar',
		component: ContagemTempoCalculosEditComponent
	}
];

export const contagemTempoCalculosRouting = RouterModule.forChild(contagemTempoCalculosRoutes);

