import { Routes } from '@angular/router';
import { AddContatosComponent } from 'app/contatos/add-contatos/add-contatos.component';
import { ContatosComponent } from 'app/contatos/contatos/contatos.component';
import { ExportarDominioComponent } from 'app/exportar-dominio/exportar-dominio.component';
import { MoveFeriadoComponent } from 'app/feriado/move-feriado/move-feriado.component';
import { AdministrarFeriasComponent } from 'app/ferias/administrar-ferias/administrar-ferias.component';
import { ArquivosFeriasComponent } from 'app/ferias/arquivos-ferias/arquivos-ferias.component';
import { FeriasComponent } from 'app/ferias/ferias/ferias.component';
import { FuncionariosComponent } from 'app/funcionario/funcionarios/funcionarios.component';
import { AdministrarHorarioTrabalhoComponent } from 'app/horario-trabalho/administrar-horario-trabalho/administrar-horario-trabalho.component';
import { AnexarHorarioTrabalhoComponent } from 'app/horario-trabalho/anexar-horario-trabalho/anexar-horario-trabalho.component';
import { ImportacaoArquivosComponent } from 'app/importacao/importacao-arquivos/importacao-arquivos.component';
import { AuthGuardService } from 'app/service/auth-guard.service';
import { AdministrarPontoComponent } from '../../administrar-ponto/administrar-ponto/administrar-ponto.component';
import { LancarPontoAtrasoComponent } from '../../administrar-ponto/lancar-ponto-atraso/lancar-ponto-atraso.component';
import { AjusteBancoDeHorasComponent } from '../../ajuste-banco-de-horas/ajuste-banco-de-horas.component';
import { BancoDeHorasComponent } from '../../banco-de-horas/banco-de-horas.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AccessComponent } from '../../errors/access/access.component';
import { AddFeriadoComponent } from '../../feriado/add-feriado/add-feriado.component';
import { FeriadosComponent } from '../../feriado/feriados/feriados.component';
import { FolhasDisponibilizadaComponent } from '../../folhas-validadas/folhas-validadas/folhas-disponibilizada.component';
import { FrequenciaComponent } from '../../frequencia/frequencia/frequencia.component';
import { AddJustificativaComponent } from '../../justificativa/add-justificativa/add-justificativa.component';
import { JustificativasComponent } from '../../justificativa/justificativas/justificativas.component';
import { LancarAtestadoComponent } from '../../lancar-atestado/lancar-atestado.component';
import { RegistrarPontoComponent } from '../../registrar-ponto/registrar-ponto/registrar-ponto.component';
import { RelatoriosComponent } from '../../relatorios/relatorios/relatorios.component';
import { AbonosComponent } from 'app/abonos/abonos.component';
import { ConfigurarFuncionarioComponent } from 'app/funcionario/configurar/configurar-funcionario.component';
import { AdministrarPerfilComponent } from 'app/perfil/administrar-perfil/administrar-perfil.component';
import { EditarPerfilComponent } from 'app/perfil/editar-perfil/editar-perfil.component';



export const AdminLayoutRoutes: Routes = [

    { path: 'banco-de-horas', component: BancoDeHorasComponent, data: { role: 'acessoBancoDeHoras' }, canActivate: [AuthGuardService], },
    { path: 'dashboard', component: DashboardComponent, data: { role: 'acessoDashboard' }, canActivate: [AuthGuardService], },
    { path: 'feriado/new', component: AddFeriadoComponent, data: { role: 'acessoFeriado' }, canActivate: [AuthGuardService], },
    { path: 'feriado/edit/:id', component: AddFeriadoComponent, data: { role: 'acessoFeriado' }, canActivate: [AuthGuardService], },
    { path: 'feriados', component: FeriadosComponent, data: { role: 'acessoFeriado' }, canActivate: [AuthGuardService], },
    { path: 'feriado/move/:id', component: MoveFeriadoComponent, data: { role: 'acessoFeriado' }, canActivate: [AuthGuardService], },
    { path: 'justificativa/new', component: AddJustificativaComponent, data: { role: 'acessoJustificativa' }, canActivate: [AuthGuardService], },
    { path: 'justificativa/edit/:id', component: AddJustificativaComponent, data: { role: 'acessoJustificativa' }, canActivate: [AuthGuardService], },
    { path: 'justificativas', component: JustificativasComponent, data: { role: 'acessoJustificativa' }, canActivate: [AuthGuardService], },
    { path: 'registrar-ponto', component: RegistrarPontoComponent, data: { role: 'registrarFrequencia' } },
    { path: 'administrar-ponto', component: AdministrarPontoComponent, data: { role: 'acessoAdmFrequencia' }, canActivate: [AuthGuardService], },
    { path: 'registrar-ponto-atraso', component: LancarPontoAtrasoComponent, data: { role: 'acessoPontoAtraso' }, canActivate: [AuthGuardService], },
    { path: 'lancar-justificativa', component: LancarAtestadoComponent, data: { role: 'acessoLancarAtestado' }, canActivate: [AuthGuardService], },
    { path: 'ajuste-banco-de-horas', component: AjusteBancoDeHorasComponent, data: { role: 'acessoAjuste' }, canActivate: [AuthGuardService], },
    { path: 'folhas-disponibilizada', component: FolhasDisponibilizadaComponent, data: { role: 'acessoSaeb' }, canActivate: [AuthGuardService], },
    { path: 'relatorios', component: RelatoriosComponent, data: { role: 'acessoRelatorios' }, canActivate: [AuthGuardService], },
    { path: 'frequencia', component: FrequenciaComponent, data: { role: 'acessoTelaFrequencia' }, canActivate: [AuthGuardService], },
    { path: 'funcionarios', component: FuncionariosComponent, data: { role: 'acessoEdicaoFuncionario' }, canActivate: [AuthGuardService], },
    { path: 'funcionarios/configurar-funcionario/:matricula', component: ConfigurarFuncionarioComponent, data: { role: 'acessoEdicaoFuncionario' }, canActivate: [AuthGuardService], },
    { path: 'exportar-dominio', component: ExportarDominioComponent, data: { role: 'acessoExportarDominio' }, canActivate: [AuthGuardService], },
    { path: 'ferias', component: FeriasComponent, data: { role: 'acessoFeriasSRF' }, canActivate: [AuthGuardService], },
    { path: 'ferias/arquivos-ferias/:id', component: ArquivosFeriasComponent, data: { role: 'acessoAdmFerias' }, canActivate: [AuthGuardService], },
    { path: 'administrar-ferias', component: AdministrarFeriasComponent, data: { role: 'acessoAdmFerias' }, canActivate: [AuthGuardService], },
    { path: 'contatos', component: ContatosComponent, data: { role: 'contatoSRF' }, canActivate: [AuthGuardService], },
    { path: 'contatos/new', component: AddContatosComponent, data: { role: 'contatoSRF' }, canActivate: [AuthGuardService], },
    { path: 'contatos/edit/:id', component: AddContatosComponent, data: { role: 'contatoSRF' }, canActivate: [AuthGuardService], },
    { path: 'anexar-horario-trabalho', component: AnexarHorarioTrabalhoComponent, data: { role: 'acessoAnexarHoraTrabSRF' }, canActivate: [AuthGuardService], },
    { path: 'administrar-horario-trabalho', component: AdministrarHorarioTrabalhoComponent, data: { role: 'acessoAdmHoraTrabSRF' }, canActivate: [AuthGuardService], },
    { path: 'editar-perfil', component: EditarPerfilComponent,data: { role: 'acessoPendenciaSRF' }, canActivate: [AuthGuardService], },
    { path: 'administrar-perfil', component: AdministrarPerfilComponent,data: { role: 'acessoAdmPendenciaSRF' }, canActivate: [AuthGuardService], },
    { path: 'importacao-arquivos', component: ImportacaoArquivosComponent, data: { role: 'acessoImportarArquivosSRF' }, canActivate: [AuthGuardService], },
    { path: 'abonos', component: AbonosComponent, data: { role: 'acessoTelaAbonosSRF' }, canActivate: [AuthGuardService], },
    { path: 'access', component: AccessComponent }
];
