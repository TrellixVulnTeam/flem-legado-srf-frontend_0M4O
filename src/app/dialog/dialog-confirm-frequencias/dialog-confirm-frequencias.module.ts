import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogConfirmFrequenciasComponent } from './dialog-confirm-frequencias.component';
import { MatOptionModule, MatSelectModule } from '@angular/material';
import { ReprovacoesService } from 'app/service/reprovacoes.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule
  ],
  declarations: [ 
    DialogConfirmFrequenciasComponent
  ],
  entryComponents: [
    DialogConfirmFrequenciasComponent
  ],
  providers: [
    ReprovacoesService
  ]
})
export class DialogConfirmFrequenciasModule { }
