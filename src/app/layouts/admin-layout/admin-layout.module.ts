import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { FormsModule } from "@angular/forms";
import { MatButtonModule, MatRippleModule, MatInputModule, MatTooltipModule, MatSelectModule } from "@angular/material";
import { FeriadoModule } from "app/feriado/feriado.module";
import { JustificativaModule } from "app/justificativa/justificativa.module";
import { FrequenciaModule } from "app/frequencia/frequencia.module";
import { DashboardModule } from "app/dashboard/dashboard.module";
import { BancoDeHorasModule } from "app/banco-de-horas/banco-de-horas.module";
import { LancarAtestadoModule } from "app/lancar-atestado/lancar-atestado.module";
import { DialogHistoricoAdministrarPontoModule } from "app/dialog/dialog-historico-administrar-ponto/dialog-historico-administrar-ponto.module";
import { ErrorsModule } from "app/errors/errors.module";
import { AjusteBancoDeHorasModule } from "app/ajuste-banco-de-horas/ajuste-banco-de-horas.module";
import { FolhasDisponibilizadaModule } from "app/folhas-validadas/folhas-validadas/folhas-disponibilizada.module";
import { RelatoriosModule } from "app/relatorios/relatorios/relatorios.module";
import { ExportarDominioModule } from "app/exportar-dominio/exportar-dominio.module";
import { FeriasModule } from "app/ferias/ferias.module";
import { FuncionarioModule } from "app/funcionario/funcionario.module";
import { ContatosModule } from "app/contatos/contatos/contatos.module";
import { UserProfileComponent } from "app/user-profile/user-profile.component";
import { TableListComponent } from "app/table-list/table-list.component";
import { TypographyComponent } from "app/typography/typography.component";
import { IconsComponent } from "app/icons/icons.component";
import { MapsComponent } from "app/maps/maps.component";
import { NotificationsComponent } from "app/notifications/notifications.component";
import { UpgradeComponent } from "app/upgrade/upgrade.component";
import { AuthGuardService } from "app/service/auth-guard.service";
import { EmitirEventoService } from "app/service/emitir-evento.service";
import { HorarioTrabalhoModule } from "app/horario-trabalho/horario-trabalho.module";
import { ImportacaoArquivosModule } from "app/importacao/importacao-arquivos/importacao-arquivos.module";
import { PerfilModule } from "app/perfil/perfil.module";
import { AbonosModule } from "app/abonos/abonos.module";


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    FeriadoModule,
    JustificativaModule,
    FrequenciaModule,
    DashboardModule,
    BancoDeHorasModule,
    LancarAtestadoModule,
    MatSelectModule,
    DialogHistoricoAdministrarPontoModule,
    ErrorsModule,
    AjusteBancoDeHorasModule,
    FolhasDisponibilizadaModule,
    RelatoriosModule,
    ExportarDominioModule,
    FeriasModule,
    FuncionarioModule,
    ContatosModule,
    HorarioTrabalhoModule,
    PerfilModule,
    ImportacaoArquivosModule,
    AbonosModule
  ],
  declarations: [
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent
  ],
  providers: [AuthGuardService, EmitirEventoService],
 
})

export class AdminLayoutModule {}
