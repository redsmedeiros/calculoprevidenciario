import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RgpsSeguradosIndexComponent } from './rgps-segurados-index/rgps-segurados-index.component';
import { RgpsSeguradosCreateComponent } from './rgps-segurados-create/rgps-segurados-create.component';
import { RgpsSeguradosDestroyComponent } from './rgps-segurados-destroy/rgps-segurados-destroy.component';
import { RgpsSeguradosFormComponent } from './rgps-segurados-form/rgps-segurados-form.component';
import { RgpsSeguradosEditComponent } from './rgps-segurados-edit/rgps-segurados-edit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RgpsSeguradosIndexComponent, RgpsSeguradosCreateComponent, RgpsSeguradosDestroyComponent, RgpsSeguradosFormComponent, RgpsSeguradosEditComponent]
})
export class +rgpsSeguradosModule { }
