import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routesTutorial: Routes = [
  {
    path: '',
    loadChildren: 'app/+tutorial/tutorial-list/tutorial-list.module#TutorialListModule',
    data: {pageTitle: 'Todos os tutoriais'}
  },
  {
    path: 'video',
    loadChildren: 'app/+tutorial/tutorial-video/tutorial-video.module#TutorialVideoModule',
    data: {pageTitle: 'Tutorial'}
  },
];

export const routingTutorial = RouterModule.forChild(routesTutorial);
