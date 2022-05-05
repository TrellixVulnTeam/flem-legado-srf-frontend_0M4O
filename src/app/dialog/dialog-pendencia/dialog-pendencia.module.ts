import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPendenciaComponent } from './dialog-pendencia.component';
import { AdministrarHorarioTrabalhoComponent } from 'app/horario-trabalho/administrar-horario-trabalho/administrar-horario-trabalho.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSortModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatExpansionModule, MatTooltipModule, MatProgressSpinnerModule, MatSelectModule, MatOptionModule, MatCheckboxModule } from '@angular/material';

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
    MatExpansionModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
  ],
  declarations: [DialogPendenciaComponent],
  entryComponents: [DialogPendenciaComponent,AdministrarHorarioTrabalhoComponent]
})
export class DialogPendenciaModule { }
  