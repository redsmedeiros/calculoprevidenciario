import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../+auth/+login/login.component';
import {SmartadminModule} from '../shared/smartadmin.module';
import {SmartadminDatatableModule} from '../shared/ui/datatable/smartadmin-datatable.module';
import { logoutRouting } from './logout.routing';
import { LogoutComponent } from './logout.component';

@NgModule({
  imports: [
    CommonModule,
    logoutRouting,
    SmartadminModule,
    SmartadminDatatableModule,
  ],
  declarations: [
    LogoutComponent,
    LoginComponent
  ],
  providers: [],
})
export class LogoutModule { }
