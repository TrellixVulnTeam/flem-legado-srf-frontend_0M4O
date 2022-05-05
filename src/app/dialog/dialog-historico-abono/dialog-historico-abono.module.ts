import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHistoricoAbonoComponent } from './dialog-historico-abono.component';
import { AbonosComponent } from 'app/abonos/abonos.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PipeModule } from 'app/pipe/pipe.module';
import { MatSortModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  declarations: [
    DialogHistoricoAbonoComponent
  ],
  entryComponents: [DialogHistoricoAbonoComponent,AbonosComponent]
  })
export class DialogHistoricoAbonoModule { }
