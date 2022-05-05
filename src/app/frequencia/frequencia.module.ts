import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule, MatInputModule, MatRippleModule, MatButtonModule, MatExpansionModule, MatSelectModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule, MatRadioModule, MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FrequenciaService } from '../service/frequencia.service';
import { TextMaskModule } from 'angular2-text-mask';
import { FrequenciaComponent } from './frequencia/frequencia.component';
import { EnumPipe } from '../pipe/enum.pipe';
import { DateHelperPipe } from '../pipe/date-helper.pipe';
import { ComponentsModule } from '../components/components.module';
import { FileService } from 'app/service/file.service';
import { DialogConfirmFrequenciasModule } from 'app/dialog/dialog-confirm-frequencias/dialog-confirm-frequencias.module';
import { DialogHistoricoFrequenciaModule } from 'app/dialog/dialog-historico-frequencia/dialog-historico-frequencia.module';

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
    TextMaskModule,
    MatSelectModule,
    ComponentsModule,
    TextMaskModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DialogConfirmFrequenciasModule,
    DialogHistoricoFrequenciaModule,
    MatRadioModule,
    MatAutocompleteModule,
  ],
  declarations: [
    FrequenciaComponent,
    EnumPipe,
    DateHelperPipe
  ],
  exports: [
    FrequenciaComponent,
    DateHelperPipe,
    TextMaskModule,
    EnumPipe
  ],  
  providers: [
    FrequenciaService,
    FileService
  ]
})
export class FrequenciaModule { }
