import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule, MatInputModule } from '@angular/material';
import { PipeModule } from 'app/pipe/pipe.module';
import { DialogReprovarAbonoComponent } from './dialog-reprovar-abono.component';
import { AbonosComponent } from 'app/abonos/abonos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    PipeModule,
    MatInputModule
  ],
  declarations: [
    DialogReprovarAbonoComponent
  ],
  entryComponents: [DialogReprovarAbonoComponent,AbonosComponent]
})
export class DialogReprovarAbonoModule { }  
