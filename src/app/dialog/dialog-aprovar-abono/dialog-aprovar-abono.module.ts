import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { AbonosComponent } from 'app/abonos/abonos.component';
import { PipeModule } from 'app/pipe/pipe.module';
import { DialogAprovarAbonoComponent } from './dialog-aprovar-abono.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    PipeModule
  ],
  declarations: [
    DialogAprovarAbonoComponent
  ],
  entryComponents: [DialogAprovarAbonoComponent,AbonosComponent]
})
export class DialogAprovarAbonoModule { }
