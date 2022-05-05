import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHistoricoAdministrarPontoComponent } from './dialog-historico-administrar-ponto.component';
import { DialogHistoricoAdministrarPontoService } from '../../service/dialog-historico-administrar-ponto.service';
import { MatSortModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  providers: [
    DialogHistoricoAdministrarPontoService
  ],
  declarations: [
    DialogHistoricoAdministrarPontoComponent
  ],
  entryComponents: [DialogHistoricoAdministrarPontoComponent]
})
export class DialogHistoricoAdministrarPontoModule { }
