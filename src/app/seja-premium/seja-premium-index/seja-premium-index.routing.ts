import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SejaPremiumIndexComponent } from './seja-premium-index.component';


const routesSejaPremiumIndex: Routes = [
  {
    path: '',
    component: SejaPremiumIndexComponent
}
];

export const routingSejaPremiumIndex = RouterModule.forChild(routesSejaPremiumIndex);
