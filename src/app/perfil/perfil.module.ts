import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrarPerfilComponent } from './administrar-perfil/administrar-perfil.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ComponentsModule } from 'app/components/components.module';
import { MatFormFieldModule, MatInputModule, MatTooltipModule, MatSortModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatGridListModule } from '@angular/material';
import { DialogHistoricoArquivoJornadaModule } from 'app/dialog/dialog-historico-arquivo-jornada/dialog-historico-arquivo-jornada.module';
import { DialogAprovarReprovarAnexoFolhaModule } from 'app/dialog/dialog-aprovar-reprovar-anexo-folha/dialog-aprovar-reprovar-anexo-folha.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DadosFuncionarioService } from 'app/service/dados-funcionario.service';
import { TextMaskModule } from 'angular2-text-mask';
import { FuncionarioService } from 'app/service/funcionario.service';
import { DialogPendenciaModule } from 'app/dialog/dialog-pendencia/dialog-pendencia.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    MatFormFieldModule,
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
    DialogHistoricoArquivoJornadaModule,
    DialogPendenciaModule,
    TextMaskModule,
    MatGridListModule
  ],
  declarations: [
    AdministrarPerfilComponent,
    EditarPerfilComponent],
    providers:[DadosFuncionarioService, FuncionarioService]
})
export class PerfilModule { }
