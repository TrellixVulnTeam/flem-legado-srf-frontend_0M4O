import { FeriadoModule } from './../feriado/feriado.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddJustificativaComponent } from './add-justificativa/add-justificativa.component';
import { JustificativasComponent } from './justificativas/justificativas.component';
import { MatTooltipModule, MatInputModule, MatRippleModule, MatButtonModule, MatCheckboxModule, MatOptionModule, MatSelectModule, MatAutocompleteModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { JustificativasService } from '../service/justificativas.service';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { PipeModule } from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FrequenciaModule,
    FeriadoModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    PipeModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  declarations: [
    AddJustificativaComponent,
    JustificativasComponent,

  ],
  exports: [
    AddJustificativaComponent,
    JustificativasComponent,
  ],  
  providers: [
    JustificativasService
  ]
})
export class JustificativaModule { }
