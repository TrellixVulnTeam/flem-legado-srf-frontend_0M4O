import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatDatepickerModule, MatNativeDateModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule, MAT_DATE_LOCALE } from '@angular/material';
import { ComponentsModule } from '../components/components.module';
import { DialogAprovarReprovarAbonoModule } from '../dialog/dialog-aprovar-reprovar-abono/dialog-aprovar-reprovar-abono.module';
import { DialogAprovarMarcacaoModule } from '../dialog/dialog-aprovar-marcacao/dialog-aprovar-marcacao.module';
import { DialogConfirmModule } from '../dialog/dialog-confirm/dialog-confirm.module';
import { DialogFolhaPontoModule } from '../dialog/dialog-folha-ponto/dialog-folha-ponto.module';
import { DialogHistoricoAdministrarPontoModule } from '../dialog/dialog-historico-administrar-ponto/dialog-historico-administrar-ponto.module';
import { DialogReprovarMarcacoesModule } from '../dialog/dialog-reprovar-marcacoes/dialog-reprovar-marcacoes.module';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { Marcacao } from '../model/marcacao';
import { GroupMarcacaoPipe } from '../pipe/group-marcacao.pipe';
import { FrequenciaService } from '../service/frequencia.service';
import { MarcacoesService } from '../service/marcacoes.service';
import { AdministrarPontoComponent } from './administrar-ponto/administrar-ponto.component';
import { BtAcaoComponent } from './bt-acao/bt-acao.component';
import { LancarPontoAtrasoComponent } from './lancar-ponto-atraso/lancar-ponto-atraso.component';
import { MarcacoesComponent } from './marcacoes/marcacoes.component';
import { DialogObservacaoAssinaturaFrequenciaModule } from 'app/dialog/dialog-observacao-assinatura-frequencia/dialog-observacao-assinatura-frequencia.module';



@NgModule({
  imports: [
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    FrequenciaModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FrequenciaModule,
    DialogHistoricoAdministrarPontoModule,
    DialogAprovarMarcacaoModule,
    ComponentsModule,
    DialogFolhaPontoModule,
    DialogConfirmModule,
    DialogAprovarReprovarAbonoModule,
    MatProgressSpinnerModule,
    DialogReprovarMarcacoesModule,
    MatCardModule,
    DialogObservacaoAssinaturaFrequenciaModule
  ],
  exports: [
    GroupMarcacaoPipe,
  ],
  declarations: [
    AdministrarPontoComponent, 
    LancarPontoAtrasoComponent,
    GroupMarcacaoPipe,
    MarcacoesComponent,
    BtAcaoComponent
  ], 
  providers: [
    FrequenciaService,
    MarcacoesService,
    Marcacao,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
})
export class AdministrarPontoModule {}
