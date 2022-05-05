import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AjusteBancoDeHorasComponent } from './ajuste-banco-de-horas.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatProgressSpinnerModule, MatSelectModule, MatOptionModule, MatDatepickerModule } from '@angular/material';
import { AdministrarPontoModule } from '../administrar-ponto/administrar-ponto.module';
import { ComponentsModule } from '../components/components.module';
import { TextMaskModule } from 'angular2-text-mask';
import { AjusteService } from '../service/ajuste.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    ComponentsModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TextMaskModule
  ],
  declarations: [
   AjusteBancoDeHorasComponent
  ],
  exports: [
    AjusteBancoDeHorasComponent
  ],  
  providers: [
    AjusteService
  ]
})
export class AjusteBancoDeHorasModule { }
