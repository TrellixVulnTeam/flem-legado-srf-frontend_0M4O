import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHistoricoExportarDominioComponent } from './dialog-historico-exportar-dominio.component';
import { ExportarDominioComponent } from 'app/exportar-dominio/exportar-dominio.component';
import { MatExpansionModule, MatPaginatorModule, MatInputModule, MatFormFieldModule, MatTableModule, MatSortModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  declarations: [
    DialogHistoricoExportarDominioComponent
  ],
  entryComponents: [DialogHistoricoExportarDominioComponent,ExportarDominioComponent]
})
export class DialogHistoricoExportarDominioModule { }
