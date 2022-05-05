import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHistoricoArquivoJornadaComponent } from './dialog-historico-arquivo-jornada.component';
import { AdministrarHorarioTrabalhoComponent } from 'app/horario-trabalho/administrar-horario-trabalho/administrar-horario-trabalho.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSortModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  declarations: [DialogHistoricoArquivoJornadaComponent],
  entryComponents: [DialogHistoricoArquivoJornadaComponent,AdministrarHorarioTrabalhoComponent]
})
export class DialogHistoricoArquivoJornadaModule { }
  