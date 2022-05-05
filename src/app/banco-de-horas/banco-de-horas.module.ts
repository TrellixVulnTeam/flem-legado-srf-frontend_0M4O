import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { BancoDeHorasService } from 'app/service/banco-de-horas.service';
import { AdministrarPontoModule } from '../administrar-ponto/administrar-ponto.module';
import { ComponentsModule } from '../components/components.module';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { RegistrarPontoModule } from '../registrar-ponto/registrar-ponto.module';
import { BancoDeHorasComponent } from './banco-de-horas.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TextMaskModule,
    MatSelectModule,
    FrequenciaModule,
    RegistrarPontoModule,
    AdministrarPontoModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    AdministrarPontoModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ComponentsModule
  ],
  declarations: [
    BancoDeHorasComponent
  ],
  exports: [
    BancoDeHorasComponent
  ],  
  providers: [
    BancoDeHorasService
  ]
})
export class BancoDeHorasModule { }
