
import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'home',
    loadChildren: 'app/+home/+home/home.module#HomeModule',
    data: {pageTitle: 'Home'}
  },
  {
  	path: '',
    loadChildren: 'app/+home/+home/home.module#HomeModule',
    data: {pageTitle: 'Home'}
  }
  
];

export const routing = RouterModule.forChild(routes);
