import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialListComponent } from './tutorial-list.component';

const routesTutorialList: Routes = [
  {
    path: '',
    component: TutorialListComponent
  },
  {
    path: 'video/:id',
    component: TutorialListComponent
  }
];

export const routingTutorialList = RouterModule.forChild(routesTutorialList);
