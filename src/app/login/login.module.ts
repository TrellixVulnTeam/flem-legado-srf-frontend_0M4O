import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AutenticacaoService } from '../service/autenticacao.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { EmitirEventoService } from '../service/emitir-evento.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],  
  providers: [
    AutenticacaoService,
    EmitirEventoService
  ]
})
export class LoginModule { }
