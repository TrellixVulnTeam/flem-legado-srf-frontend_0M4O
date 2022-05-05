import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogHistoricoFrequenciaComponent } from './dialog-historico-frequencia.component';
import { MatSortModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule,
  ],
  declarations: [ DialogHistoricoFrequenciaComponent],
  entryComponents: [DialogHistoricoFrequenciaComponent]
})
export class DialogHistoricoFrequenciaModule { }
