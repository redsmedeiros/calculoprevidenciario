import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routesSejaPremium: Routes = [
  {
    path: '',
    loadChildren: 'app/seja-premium/seja-premium-index/seja-premium-index.module#SejaPremiumIndexModule',
    data: {pageTitle: 'Todos os tutoriais'}
  }
];

export const routingSejaPremium = RouterModule.forChild(routesSejaPremium);

