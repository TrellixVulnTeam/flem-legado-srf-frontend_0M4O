import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { DialogUploadArquivoFeriasComponent } from './dialog-upload-arquivo-ferias.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule
  ],
  providers: [
    ArquivosFeriasService
  ],
  declarations: [
    DialogUploadArquivoFeriasComponent,
  ],
  entryComponents: [DialogUploadArquivoFeriasComponent]   
})
export class DialogUploadArquivoFeriasModule { }  
