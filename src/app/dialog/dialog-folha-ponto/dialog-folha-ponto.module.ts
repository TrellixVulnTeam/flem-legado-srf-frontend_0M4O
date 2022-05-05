import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogFolhaPontoComponent } from './dialog-folha-ponto.component';
import { AdministrarPontoComponent } from '../../administrar-ponto/administrar-ponto/administrar-ponto.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
  ],
  providers: [
    
  ],
  declarations: [
    DialogFolhaPontoComponent,
  ],
  entryComponents: [DialogFolhaPontoComponent]  
})
export class DialogFolhaPontoModule { }
