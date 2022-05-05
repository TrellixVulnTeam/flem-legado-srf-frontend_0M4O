import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportacaoArquivosComponent } from './importacao-arquivos.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule, MatSortModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule

  ],
  declarations: [
    ImportacaoArquivosComponent
  ]
})
export class ImportacaoArquivosModule { }
