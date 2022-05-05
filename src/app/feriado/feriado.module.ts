import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatRippleModule, MatTooltipModule, MAT_DATE_LOCALE } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'app/components/components.module';
import { LancarAtestadoModule } from 'app/lancar-atestado/lancar-atestado.module';
import { PipeModule } from 'app/pipe/pipe.module';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { FeriadosService } from '../service/feriados.service';
import { AddFeriadoComponent } from './add-feriado/add-feriado.component';
import { FeriadosComponent } from './feriados/feriados.component';
import { MoveFeriadoComponent } from './move-feriado/move-feriado.component';

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
    LancarAtestadoModule,
    ComponentsModule,
    PipeModule
  ],
  declarations: [
    AddFeriadoComponent,
    FeriadosComponent,
    MoveFeriadoComponent
  ],
  exports: [
    AddFeriadoComponent,
    FeriadosComponent,
    RouterModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],  
  providers: [
    FeriadosService, { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class FeriadoModule { }
