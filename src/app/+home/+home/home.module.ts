import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeRouting } from './home.routing';
import {HomeComponent} from "./home.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    CommonModule,
    homeRouting,
    SmartadminModule,
    SmartadminDatatableModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
