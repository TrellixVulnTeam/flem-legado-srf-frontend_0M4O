import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule, MAT_DATE_LOCALE } from '@angular/material';
import { AdministrarPontoModule } from '../administrar-ponto/administrar-ponto.module';
import { ComponentsModule } from '../components/components.module';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { AbonoService } from '../service/abono.service';
import { FileService } from '../service/file.service';
import { JustificativasService } from '../service/justificativas.service';
import { LancarAtestadoComponent } from './lancar-atestado.component';
import { PipeModule } from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FrequenciaModule,
    ReactiveFormsModule,
    ComponentsModule,
    AdministrarPontoModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    PipeModule
  ],
  declarations: [
    LancarAtestadoComponent,
  ],
  exports: [
    MatDatepickerModule,
  ],
  providers: [
    FileService, { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    AbonoService,
    JustificativasService
  ]
})
export class LancarAtestadoModule { }
