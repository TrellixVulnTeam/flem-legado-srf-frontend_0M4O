import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../service/user-data.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    visible: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', visible: this.userData.hasPermission("acessoDashboard") },
    { path: '/registrar-ponto', title: 'Registrar Frequência',  icon:'timer', class: '', visible: this.userData.hasPermission('registrarFrequencia') }, 
    { path: '/administrar-ponto', title: 'Administrar Frequência',  icon:'description', class: '', visible: this.userData.hasPermission('acessoAdmFrequencia') },
    { path: '/feriados', title: 'Feriados',  icon: 'calendar_today', class: '', visible: this.userData.hasPermission('acessoFeriado') },
    { path: '/registrar-ponto-atraso', title: 'Frequência Manual',  icon: 'alarm_add', class: '', visible: this.userData.hasPermission('acessoPontoAtraso') },
    { path: '/justificativas', title: 'Justificativas',  icon: 'feedback', class: '', visible: this.userData.hasPermission('acessoJustificativa') },
    { path: '/lancar-justificativa', title: 'Justificar Ausência',  icon: 'local_hospital', class: '', visible: this.userData.hasPermission('acessoLancarAtestado') },
    { path: '/banco-de-horas', title: 'Banco de Horas',  icon: 'assignment', class: '', visible: this.userData.hasPermission('acessoBancoDeHoras') },
    { path: '/ajuste-banco-de-horas', title: 'Ajuste Banco de Horas',  icon: 'iso', class: '', visible: this.userData.hasPermission('acessoAjuste') },
    { path: '/folhas-disponibilizada', title: 'Frequências Disponiblizadas',  icon: 'alarm_on', class: '', visible: this.userData.hasPermission('acessoSaeb')  },
    { path: '/relatorios', title: 'Relatorios',  icon: 'insert_drive_file', class: '', visible: this.userData.hasPermission('acessoRelatorios')  },
    { path: '/frequencia', title: 'Frequencias',  icon: 'access_time', class: '', visible: this.userData.hasPermission('acessoTelaFrequencia')   },
    { path: '/exportar-dominio', title: 'Exportar Domínio',  icon: 'unarchive', class: '', visible: this.userData.hasPermission('acessoExportarDominio')  },
    { path: '/ferias', title: 'Férias',  icon: 'beach_access', class: '', visible: this.userData.hasPermission('acessoFeriasSRF') },
    { path: '/administrar-ferias', title: 'Administrar Férias',  icon: 'beach_access', class: '', visible: this.userData.hasPermission('acessoAdmFerias') },
    { path: '/funcionarios', title: 'Funcionários',  icon: 'people', class: '', visible: this.userData.hasPermission('acessoEdicaoFuncionario')   },
    { path: '/contatos', title: 'Contatos',  icon: 'mail_outline', class: '', visible: this.userData.hasPermission('contatoSRF') },
    { path: '/anexar-horario-trabalho', title: 'Horário de Trabalho',  icon: 'business_center', class: '', visible: this.userData.hasPermission('acessoAnexarHoraTrabSRF') },
    { path: '/administrar-horario-trabalho', title: 'Adm Horário de Trabalho',  icon: 'business_center', class: '', visible: this.userData.hasPermission('acessoAdmHoraTrabSRF') },
    { path: '/administrar-perfil', title: 'Adm Perfil',  icon: 'face', class: '', visible: this.userData.hasPermission('acessoAdmPendenciaSRF') },
    { path: '/editar-perfil', title: 'Editar Perfil',  icon: 'face', class: '', visible: this.userData.hasPermission('acessoPendenciaSRF') },
    { path: '/importacao-arquivos', title: 'Importar PDF',  icon: 'publish', class: '', visible: this.userData.hasPermission('acessoImportarArquivosSRF') },
    { path: '/abonos', title: 'Abonos',  icon: 'post_add', class: '', visible: this.userData.hasPermission('acessoTelaAbonosSRF') },
    { path: '/login', title: this.label(),  icon: 'exit_to_app', class: '', visible: true } 
];

  constructor(private userData: UserDataService) {  

  }

  label(){
    if(this.userData.getCurrentUser()){
        return "Sair";
    }else{
        return "Gerenciar";
    }
  }

  ngOnInit() {

  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
