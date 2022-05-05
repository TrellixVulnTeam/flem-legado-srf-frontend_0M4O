import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogConfirmFrequenciaDisponibilizadaComponent } from './dialog-confirm-frequencia-disponibilizada.component';
import { FolhasDisponibilizadaModule } from '../../folhas-validadas/folhas-validadas/folhas-disponibilizada.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ DialogConfirmFrequenciaDisponibilizadaComponent],
  entryComponents: [DialogConfirmFrequenciaDisponibilizadaComponent]
})
export class DialogConfirmFrequenciaDisponibilizadaModule { }
