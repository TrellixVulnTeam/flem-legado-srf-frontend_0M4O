import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatProgressSpinnerModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FrequenciaService } from '../service/frequencia.service';
import { TextMaskModule } from 'angular2-text-mask';
import { DateHelperPipe } from '../pipe/date-helper.pipe';
import { DashboardService } from '../service/dashboard.service';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { RegistrarPontoModule } from '../registrar-ponto/registrar-ponto.module';
import { AdministrarPontoModule } from '../administrar-ponto/administrar-ponto.module';
import { HasPermissionDirective } from '../diretives/has-permission';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ConfirmEmailService } from '../service/confirm-email.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TextMaskModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    RouterModule,
  ],
  declarations: [
    ConfirmEmailComponent
  ],
  exports: [
    ConfirmEmailComponent
  ],  
  providers: [
    ConfirmEmailService
  ]
})
export class ConfirmEmailModule { }
