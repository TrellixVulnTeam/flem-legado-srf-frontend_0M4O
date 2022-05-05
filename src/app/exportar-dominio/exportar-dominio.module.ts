import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatExpansionModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { ExportarDominioService } from 'app/service/exportar-dominio.service';
import { FileService } from 'app/service/file.service';
import { ComponentsModule } from '../components/components.module';
import { DateHelperPipe } from '../pipe/date-helper.pipe';
import { EnumPipe } from '../pipe/enum.pipe';
import { ExportarDominioComponent } from './exportar-dominio.component';
import { DialogCompetenciaModule } from 'app/dialog/dialog-competencia/dialog-competencia.module';
import { DialogHistoricoExportarDominioModule } from 'app/dialog/dialog-historico-exportar-dominio/dialog-historico-exportar-dominio.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSelectModule,
    ComponentsModule,
    TextMaskModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    DialogCompetenciaModule,
    MatPaginatorModule,
    MatRadioModule,
    DialogHistoricoExportarDominioModule
  ],
  declarations: [
    ExportarDominioComponent
  ],
  exports: [
    ExportarDominioComponent
  ],  
  providers: [
    ExportarDominioService,
    FileService
  ]
})
export class ExportarDominioModule { }
