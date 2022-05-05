import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequenciaService } from '../../service/frequencia.service';
import { RelatoriosComponent } from './relatorios.component';
import { MatInputModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { KeyValuePipe } from '../../pipe/key-value.pipe';
import { ComponentsModule } from '../../components/components.module';
import { RelatorioService } from '../../service/relatorio.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule, 
    ComponentsModule
  ],
  declarations: [
    RelatoriosComponent,
    KeyValuePipe,
  ],
  exports: [
    KeyValuePipe
  ],  
  providers: [
    FrequenciaService, RelatorioService
  ]
})
export class RelatoriosModule { }
