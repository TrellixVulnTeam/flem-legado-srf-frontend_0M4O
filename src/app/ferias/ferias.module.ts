import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { ComponentsModule } from 'app/components/components.module';
import { DialogDownloadArquivoFeriasModule } from 'app/dialog/dialog-download-arquivo-ferias/dialog-download-arquivo-ferias.module';
import { DialogHistoricoFeriasModule } from 'app/dialog/dialog-historico-ferias/dialog-historico-ferias.module';
import { DialogUploadArquivoFeriasModule } from 'app/dialog/dialog-upload-arquivo-ferias/dialog-upload-arquivo-ferias.module';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { FeriasService } from 'app/service/ferias.service';
import { UserDataService } from 'app/service/user-data.service';
import { AdministrarFeriasComponent } from './administrar-ferias/administrar-ferias.component';
import { ArquivosFeriasComponent } from './arquivos-ferias/arquivos-ferias.component';
import { FeriasComponent } from './ferias/ferias.component';
import { DialogHistoricoArquivoModule } from 'app/dialog/dialog-historico-arquivo/dialog-historico-arquivo.module';
import { DialogAprovarReprovarFeriasModule } from 'app/dialog/dialog-aprovar-reprovar-ferias/dialog-aprovar-reprovar-ferias.module';

   

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    DialogUploadArquivoFeriasModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    DialogDownloadArquivoFeriasModule,
    MatProgressSpinnerModule,
    RouterModule,
    DialogHistoricoFeriasModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    TextMaskModule,
    DialogAprovarReprovarFeriasModule,
    MatRadioModule,
    DialogHistoricoArquivoModule,
    MatCheckboxModule
  ],
  declarations: [
    FeriasComponent,
    ArquivosFeriasComponent,
    AdministrarFeriasComponent,
  ],
  providers: [
    FeriasService,
    UserDataService,
    ArquivosFeriasService,
  ]
})
export class FeriasModule { }
