import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { MatProgressSpinnerModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatExpansionModule } from '@angular/material';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FolhasDisponibilizadaComponent } from './folhas-disponibilizada.component';
import { FolhasDisponibilizadaService } from '../../service/folhas-disponibilizada.service';
import { DialogConfirmFrequenciaDisponibilizadaModule } from '../../dialog/dialog-confirm-frequencia-disponibilizada/dialog-confirm-frequencia-disponibilizada.module';
import { FileService } from 'app/service/file.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatInputModule,
    DialogConfirmFrequenciaDisponibilizadaModule,
    MatExpansionModule    
  ],
  declarations: [
   FolhasDisponibilizadaComponent
  ],
  exports: [
    FolhasDisponibilizadaComponent
  ],  
  providers: [
    FolhasDisponibilizadaService,
    FileService
  ]
})
export class FolhasDisponibilizadaModule { }
