import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSortModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { DialogHistoricoArquivoComponent } from './dialog-historico-arquivo.component';
import { ArquivosFeriasComponent } from 'app/ferias/arquivos-ferias/arquivos-ferias.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule 
    
  ],
  providers: [
      ArquivosFeriasService
  ],
  declarations: [
    DialogHistoricoArquivoComponent,
  ],
  entryComponents: [DialogHistoricoArquivoComponent,ArquivosFeriasComponent]
})
export class DialogHistoricoArquivoModule { }
