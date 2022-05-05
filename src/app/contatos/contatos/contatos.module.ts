import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContatosComponent } from './contatos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'app/components/components.module';
import { MatProgressSpinnerModule, MatAutocomplete, MatAutocompleteModule, MatInputModule, MatTableModule, MatSortModule, MatPaginator, MatPaginatorModule, MatOptionModule, MatRadioModule } from '@angular/material';
import { ContatosService } from 'app/service/contatos.service';
import { AddContatosComponent } from '../add-contatos/add-contatos.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule

  ],
  declarations: [
    ContatosComponent,
    AddContatosComponent
  ],
  providers: [
    ContatosService
  ]
})
export class ContatosModule { }
