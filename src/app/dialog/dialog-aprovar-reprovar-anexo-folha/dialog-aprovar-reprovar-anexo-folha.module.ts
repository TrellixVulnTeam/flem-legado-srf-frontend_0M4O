import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogAprovarReprovarAnexoFolhaComponent } from './dialog-aprovar-reprovar-anexo-folha.component';
import { AdministrarHorarioTrabalhoComponent } from 'app/horario-trabalho/administrar-horario-trabalho/administrar-horario-trabalho.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule
  ],
  declarations: [DialogAprovarReprovarAnexoFolhaComponent],
  entryComponents: [DialogAprovarReprovarAnexoFolhaComponent,AdministrarHorarioTrabalhoComponent]
})
export class DialogAprovarReprovarAnexoFolhaModule { }
