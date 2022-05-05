import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatProgressSpinnerModule, MatAutocompleteModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatPaginatorIntl } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FrequenciaService } from '../service/frequencia.service';
import { TextMaskModule } from 'angular2-text-mask';
import { DateHelperPipe } from '../pipe/date-helper.pipe';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../service/dashboard.service';
import { FrequenciaModule } from '../frequencia/frequencia.module';
import { RegistrarPontoModule } from '../registrar-ponto/registrar-ponto.module';
import { AdministrarPontoModule } from '../administrar-ponto/administrar-ponto.module';
import { HasPermissionDirective } from '../diretives/has-permission';
import { AppComponent } from '../app.component';
import { ExcelService } from '../service/excel.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TextMaskModule,
    MatSelectModule,
    FrequenciaModule,
    RegistrarPontoModule,
    AdministrarPontoModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    AdministrarPontoModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ChartsModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    DashboardComponent
  ],  
  providers: [
    { provide: MatPaginatorIntl, useClass: DashboardComponent },
    DashboardService, ExcelService
  ]
})
export class DashboardModule { }
