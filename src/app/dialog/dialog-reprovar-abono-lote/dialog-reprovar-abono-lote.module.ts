import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggle, MatInputModule, MatSlideToggleModule, MatButtonToggleModule } from '@angular/material';
import { AbonosComponent } from 'app/abonos/abonos.component';
import { DialogReprovarAbonoLoteComponent } from './dialog-reprovar-abono-lote.component';
import { PipeModule } from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    PipeModule
  ],
  declarations: [
    DialogReprovarAbonoLoteComponent
  ],
  entryComponents: [
    DialogReprovarAbonoLoteComponent,
    AbonosComponent
  ]
})
export class DialogReprovarAbonoLoteModule { }
