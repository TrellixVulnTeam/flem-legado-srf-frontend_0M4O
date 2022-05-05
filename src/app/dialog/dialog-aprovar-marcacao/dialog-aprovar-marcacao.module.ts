import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogAprovarMarcacaoComponent } from './dialog-aprovar-marcacao.component';
import { AdministrarPontoComponent } from '../../administrar-ponto/administrar-ponto/administrar-ponto.component';
import { AdministrarPontoModule } from '../../administrar-ponto/administrar-ponto.module';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    
  ],
  declarations: [
    DialogAprovarMarcacaoComponent
  ],
  entryComponents: [DialogAprovarMarcacaoComponent,AdministrarPontoComponent]
})
export class DialogAprovarMarcacaoModule { }
