import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';
import { UserFunctions } from 'app/shared/functions/user-functions';

import { RgpsPlanejamentoCalculosPlanejadosComponent } from './rgps-planejamento-calculos-planejados/rgps-planejamento-calculos-planejados.component';
import { RgpsPlanejamentoResultadosComponent } from './rgps-planejamento-resultados/rgps-planejamento-resultados.component';
//import { RgpsPlanejamentoIndexComponent } from './rgps-planejamento-index/rgps-planejamento-index.component';
import { RgpsPlanejamentoSeguradosComponent } from './rgps-planejamento-segurados/rgps-planejamento-segurados.component';


let RouteUser = [];
if (UserFunctions.userCheCkPremium()) {
	RouteUser = [
		{
			path: ':step/:id_segurado/:id_calculo',
			component: RgpsPlanejamentoSeguradosComponent,
		},
		{
			path: ':step/:id_segurado',
			component: RgpsPlanejamentoSeguradosComponent,
		},
		{
			path: ':step',
			component: RgpsPlanejamentoSeguradosComponent,
		},
		{
			path: '',
			component: RgpsPlanejamentoSeguradosComponent,
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
} else {
	RouteUser = [
		// {
		// 	path: ':step/:id_segurado/:id_calculo',
		// 	loadChildren: '/app/seja-premium/seja-premium.module#SejaPremiumIndexComponent',
		// 	//component: RgpsPlanejamentoSeguradosComponent,
		// },
		// {
		// 	path: ':step/:id_segurado',
		// 	loadChildren: 'app/seja-premium/seja-premium.module#SejaPremiumIndexComponent',
		// 	///component: RgpsPlanejamentoSeguradosComponent,
		// },
		// {
		// 	path: ':step',
		// 	loadChildren: 'app/seja-premium/seja-premium.module#SejaPremiumIndexComponent',
		// 	///component: RgpsPlanejamentoSeguradosComponent,
		// },
		{
			path: '',
			loadChildren: 'app/seja-premium/seja-premium.module#SejaPremiumModule',
			//component: 'app/seja-premium/seja-premium.module#SejaPremiumModule',
		},
		// {
		// 	path: 'planejados/:id_segurado/:id',
		// 	loadChildren: 'app/seja-premium/seja-premium.module#SejaPremiumIndexComponent',
		// 	///component: RgpsPlanejamentoCalculosPlanejadosComponent
		// },
		// {
		// 	path: 'resultados/:id_segurado/:id_calculo/:id_planejamento',
		// 	loadChildren: 'app/seja-premium/seja-premium.module#SejaPremiumIndexComponent',
		// 	///component: RgpsPlanejamentoResultadosComponent
		// },
	];
}

// console.log(UserFunctions.userCheCkPremium());
// console.log(RouteUser);


export const rgpsPlanejamentoRoutes: Routes = RouteUser;

export const rgpsPlanejamentoRouting = RouterModule.forChild(rgpsPlanejamentoRoutes);
