import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrarPontoComponent } from '../../administrar-ponto/administrar-ponto/administrar-ponto.component';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import { DialogAprovarReprovarAbonoComponent } from './dialog-aprovar-reprovar-abono.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule
  ],
  declarations: [
    DialogAprovarReprovarAbonoComponent
  ],
  entryComponents: [DialogAprovarReprovarAbonoComponent,AdministrarPontoComponent]
})
export class DialogAprovarReprovarAbonoModule { }
