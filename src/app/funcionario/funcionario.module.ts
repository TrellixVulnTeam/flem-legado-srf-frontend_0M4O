import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { FrequenciaModule } from 'app/frequencia/frequencia.module';
import { FeriadoModule } from 'app/feriado/feriado.module';
import { FuncionariolocalService } from 'app/service/funcionariolocal.service';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { PipeModule } from 'app/pipe/pipe.module';
import {  ConfigurarFuncionarioComponent } from './configurar/configurar-funcionario.component';
import { MatTableModule, MatExpansionModule, MatCheckboxModule, MatSlideToggleModule, MatCardModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FrequenciaModule,
    FeriadoModule,
    DashboardModule,
    PipeModule,
    MatTableModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatCardModule
  ],
  declarations: [
    FuncionariosComponent, 
    ConfigurarFuncionarioComponent
  ],
  providers: [
    FuncionariolocalService
  ]
})
export class FuncionarioModule { }
