import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrarPontoComponent } from '../../administrar-ponto/administrar-ponto/administrar-ponto.component';
import { DialogConfirmComponent } from './dialog-confirm.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [DialogConfirmComponent],
  entryComponents: [DialogConfirmComponent,AdministrarPontoComponent]
})
export class DialogConfirmModule { }
