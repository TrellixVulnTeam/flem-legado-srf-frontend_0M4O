import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentsModule } from 'app/components/components.module';
import { HorarioTrabalhoService } from 'app/service/horario-trabalho.service';
import { MatCheckboxModule, MatOptionModule, MatSelectModule, MatProgressSpinnerModule, MatPaginatorModule, MatTableModule, MatSortModule, MatTooltipModule, MatInputModule } from '@angular/material';
import { AdministrarHorarioTrabalhoComponent } from './administrar-horario-trabalho/administrar-horario-trabalho.component';
import { AnexarHorarioTrabalhoComponent } from './anexar-horario-trabalho/anexar-horario-trabalho.component';
import { DialogAprovarReprovarAnexoFolhaModule } from 'app/dialog/dialog-aprovar-reprovar-anexo-folha/dialog-aprovar-reprovar-anexo-folha.module';
import { DialogHistoricoArquivoJornadaModule } from 'app/dialog/dialog-historico-arquivo-jornada/dialog-historico-arquivo-jornada.module';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
    DialogAprovarReprovarAnexoFolhaModule,
    DialogHistoricoArquivoJornadaModule
  ],
  declarations: [
    AnexarHorarioTrabalhoComponent,
    AdministrarHorarioTrabalhoComponent
  ],
  providers: [
    HorarioTrabalhoService
  ]

})
export class HorarioTrabalhoModule { }
