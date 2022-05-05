import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogEnviarArquivoAbonoComponent } from './dialog-enviar-arquivo-abono.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { PipeModule } from 'app/pipe/pipe.module';
import { AbonosComponent } from 'app/abonos/abonos.component';

@NgModule({
imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatSlideToggleModule,
  PipeModule
],
declarations: [
  DialogEnviarArquivoAbonoComponent
],
entryComponents: [DialogEnviarArquivoAbonoComponent,AbonosComponent]
})
export class DialogEnviarArquivoAbonoModule { }
