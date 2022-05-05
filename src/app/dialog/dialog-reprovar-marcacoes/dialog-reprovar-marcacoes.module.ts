import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';
import { DialogReprovarMarcacoesComponent } from './dialog-reprovar-marcacoes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    
  ],
  declarations: [
    DialogReprovarMarcacoesComponent
  ],
  entryComponents: [DialogReprovarMarcacoesComponent]
})
export class DialogReprovarMarcacoesModule { }
