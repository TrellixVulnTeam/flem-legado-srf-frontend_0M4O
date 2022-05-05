import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatInputModule } from '@angular/material';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { DialogAprovarReprovarFeriasComponent } from './dialog-aprovar-reprovar-ferias.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule
  ],
  providers: [
    ArquivosFeriasService
  ],
  declarations: [
    DialogAprovarReprovarFeriasComponent, 
  ],
  entryComponents: [DialogAprovarReprovarFeriasComponent]  
})
export class DialogAprovarReprovarFeriasModule { }
