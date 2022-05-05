import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule, MatSelectModule } from '@angular/material';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { DialogDownloadArquivoFeriasComponent } from './dialog-download-arquivo-ferias.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
    ArquivosFeriasService
  ],
  declarations: [
    DialogDownloadArquivoFeriasComponent
  ],
  entryComponents: [DialogDownloadArquivoFeriasComponent]  
})
export class DialogDownloadArquivoFeriasModule { }   

