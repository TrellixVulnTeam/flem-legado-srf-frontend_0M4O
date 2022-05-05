import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogObservacaoAssinaturaFrequenciaComponent } from './dialog-observacao-assinatura-frequencia.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ DialogObservacaoAssinaturaFrequenciaComponent],
  entryComponents: [DialogObservacaoAssinaturaFrequenciaComponent]
})
export class DialogObservacaoAssinaturaFrequenciaModule { }
