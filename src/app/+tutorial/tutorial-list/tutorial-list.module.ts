import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { routingTutorialList } from './tutorial-video.routing';

import { TutorialListComponent } from './tutorial-list.component';
import { TutorialVideoComponent } from '../tutorial-video/tutorial-video.component';


@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    SmartadminDatatableModule,
    routingTutorialList,
  ],
  declarations: [
    TutorialListComponent,
    TutorialVideoComponent
  ]
})
export class TutorialListModule { }
