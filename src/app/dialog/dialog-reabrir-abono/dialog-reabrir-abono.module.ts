import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogReabrirAbonoComponent } from './dialog-reabrir-abono.component';
import { AbonosComponent } from 'app/abonos/abonos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
  ],
  declarations: [
    DialogReabrirAbonoComponent
  ],
  entryComponents: [DialogReabrirAbonoComponent,AbonosComponent]
})
export class DialogReabrirAbonoModule { }
