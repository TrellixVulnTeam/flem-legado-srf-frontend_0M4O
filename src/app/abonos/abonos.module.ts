import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { ComponentsModule } from 'app/components/components.module';
import { DialogAprovarAbonoModule } from 'app/dialog/dialog-aprovar-abono/dialog-aprovar-abono.module';
import { DialogEnviarArquivoAbonoModule } from 'app/dialog/dialog-enviar-arquivo-abono/dialog-enviar-arquivo-abono.module';
import { DialogReabrirAbonoModule } from 'app/dialog/dialog-reabrir-abono/dialog-reabrir-abono.module';
import { DialogReprovarAbonoModule } from 'app/dialog/dialog-reprovar-abono/dialog-reprovar-abono.module';
import { PipeModule } from 'app/pipe/pipe.module';
import { AbonosComponent } from './abonos.component';
import { DialogHistoricoAbonoModule } from 'app/dialog/dialog-historico-abono/dialog-historico-abono.module';
import { DialogReprovarAbonoLoteModule } from 'app/dialog/dialog-reprovar-abono-lote/dialog-reprovar-abono-lote.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
    TextMaskModule,
    MatIconModule,
    PipeModule,
    MatAutocompleteModule,
    MatCardModule,
    DialogAprovarAbonoModule,
    DialogReprovarAbonoModule,
    DialogReabrirAbonoModule,
    DialogEnviarArquivoAbonoModule,
    DialogHistoricoAbonoModule,
    DialogReprovarAbonoLoteModule
  ],
  declarations: [
    AbonosComponent
  ] 
})
export class AbonosModule { }  
