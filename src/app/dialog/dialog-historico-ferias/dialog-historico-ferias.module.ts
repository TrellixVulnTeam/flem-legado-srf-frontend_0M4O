import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHistoricoFeriasComponent } from './dialog-historico-ferias.component';
import { FormsModule } from '@angular/forms';
import { FeriasService } from 'app/service/ferias.service';
import { MatSortModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule
    
  ],
  providers: [
      FeriasService
  ],
  declarations: [
    DialogHistoricoFeriasComponent,
  ],
  entryComponents: [DialogHistoricoFeriasComponent]  
})
export class DialogHistoricoFeriasModule { }      
