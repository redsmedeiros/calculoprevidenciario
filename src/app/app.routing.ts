/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {pageTitle: 'Home'},
    children: [
      {
        path: '', 
        // redirectTo: 'home/home', 
        // pathMatch: 'full'
        loadChildren: 'app/+home/home-showcase.module#HomeModule',
        data: {pageTitle: 'Home'}
      },
      // {
      //   path: 'dashboard',
      //   loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
      //   data: {pageTitle: 'Dashboard'}
      // },
      {
        path: 'home',
        loadChildren: 'app/+home/home-showcase.module#HomeModule',
        data: {pageTitle: 'Home'}
      },
      // {
      //   path: 'smartadmin',
      //   loadChildren: 'app/+smartadmin-intel/smartadmin-intel.module#SmartadminIntelModule',
      //   data: {pageTitle: 'Smartadmin'}
      // },
      // {
      //   path: 'app-views',
      //   loadChildren: 'app/+app-views/app-views.module#AppViewsModule',
      //   data: {pageTitle: 'App Views'}
      // },
      // {
      //   path: 'calendar',
      //   loadChildren: 'app/+calendar/calendar.module#CalendarModule'
      // },
      // {
      //   path: 'e-commerce',
      //   loadChildren: 'app/+e-commerce/e-commerce.module#ECommerceModule',
      //   data: {pageTitle: 'E-commerce'}
      // },
      // {
      //   path: 'forms',
      //   loadChildren: 'app/+forms/forms-showcase.module#FormsShowcaseModule',
      //   data: {pageTitle: 'Forms'}
      // },
      {
        path: 'rgps',
        loadChildren: 'app/+rgps/rgps-showcase.module#RgpsShowcaseModule',
        data: {pageTitle: 'RGPS'}
      },
      {
        path: 'beneficios',
        loadChildren: 'app/+beneficios/beneficios-showcase.module#BeneficiosShowcaseModule',
        data: {pageTitle: 'Beneficios'}
      },
      {
        path: 'contribuicoes',
        loadChildren: 'app/+contribuicoes/contribuicoes-showcase.module#ContribuicoesShowcaseModule',
        data: {pageTitle: 'Contribuicoes'}
      },
      // {
      //   path: 'graphs',
      //   loadChildren: 'app/+graphs/graphs-showcase.module#GraphsShowcaseModule',
      //   data: {pageTitle: 'Graphs'}
      // },
      // {
      //   path: 'maps',
      //   loadChildren: 'app/+maps/maps.module#MapsModule',
      //   data: {pageTitle: 'Maps'}
      // },
      // {
      //   path: 'miscellaneous',
      //   loadChildren: 'app/+miscellaneous/miscellaneous.module#MiscellaneousModule',
      //   data: {pageTitle: 'Miscellaneous'}
      // },
      // {
      //   path: 'outlook',
      //   loadChildren: 'app/+outlook/outlook.module#OutlookModule',
      //   data: {pageTitle: 'Outlook'}
      // },
      // {
      //   path: 'tables',
      //   loadChildren: 'app/+tables/tables.module#TablesModule',
      //   data: {pageTitle: 'Tables'}
      // },
      // {
      //   path: 'ui',
      //   loadChildren: 'app/+ui-elements/ui-elements.module#UiElementsModule',
      //   data: {pageTitle: 'Ui'}
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: 'app/+widgets/widgets-showcase.module#WidgetsShowcaseModule',
      //   data: {pageTitle: 'Widgets'}
      // },
      {
        path: 'contagem-tempo',
        loadChildren: 'app/+contagem-tempo/contagem-tempo-showcase.module#ContagemTempoShowcaseModule',
        data: {pageTitle: 'Contagem Tempo'}
      },
      {
        path: 'moeda-import',
        loadChildren: 'app/+moeda-import/moeda-import.module#MoedaImportModule',
        data: {pageTitle: 'Importação dos dados para tabela de Moeda'}
      }
      ,
      {
        path: 'importador-cnis',
        loadChildren: 'app/+importador-cnis/importador-cnis.module#ImportadorCnisModule',
        data: {pageTitle: 'Importação CNIS'}
      }
    ]
  },

  //{path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},

  {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
