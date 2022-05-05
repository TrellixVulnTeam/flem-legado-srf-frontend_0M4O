import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FuncionarioComponent } from './funcionario/funcionario.component';
import { FuncionarioService } from '../service/funcionario.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatExpansionModule, MatInputModule, MatOptionModule, MatCardModule } from '@angular/material';
import { ProjetosModule } from './projetos/projetos/projetos.module';
import { ProjetosComponent } from './projetos/projetos/projetos.component';
import { HasPermissionDirective } from '../diretives/has-permission';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCardModule,
    ProjetosModule,
    MatInputModule,
    MatOptionModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    FuncionarioComponent,
    ProjetosComponent,
    HasPermissionDirective
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    FuncionarioComponent,
    ProjetosComponent,
    MatExpansionModule
    
  ],  
  providers: [FuncionarioService]
})
export class ComponentsModule { }
