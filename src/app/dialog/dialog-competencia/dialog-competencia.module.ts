import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogCompetenciaComponent } from './dialog-competencia.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    MatProgressSpinnerModule
  ],
  declarations: [DialogCompetenciaComponent],
  entryComponents: [DialogCompetenciaComponent]
})
export class DialogCompetenciaModule { }
