
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { routingTutorialVideo } from './tutorial-video.routing';
import { TutorialVideoComponent } from './tutorial-video.component';


@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    SmartadminDatatableModule,
    routingTutorialVideo
  ],
  declarations: [TutorialVideoComponent]
})
export class TutorialVideoModule { }
