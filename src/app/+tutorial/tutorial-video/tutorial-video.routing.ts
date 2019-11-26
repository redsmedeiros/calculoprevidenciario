import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialVideoComponent } from './tutorial-video.component';

const routesTutorialVideo: Routes = [
  {
    path: '',
    component: TutorialVideoComponent
}
];

export const routingTutorialVideo = RouterModule.forChild(routesTutorialVideo);
