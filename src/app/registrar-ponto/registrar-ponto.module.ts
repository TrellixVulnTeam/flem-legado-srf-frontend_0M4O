import { DialogConfirmarEmailModule } from './../dialog/dialog-confirmar-email/dialog-confirmar-email.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RegistrarPontoComponent } from './registrar-ponto/registrar-ponto.component';
import { RouterModule } from '@angular/router';
import { FrequenciaService } from '../service/frequencia.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { ComunicacaoService } from '../service/comunicacao.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    DialogConfirmarEmailModule
  ],
  declarations: [RegistrarPontoComponent], 
  providers: [
    FrequenciaService, DatePipe, ComunicacaoService
  ],
})
export class RegistrarPontoModule { }
