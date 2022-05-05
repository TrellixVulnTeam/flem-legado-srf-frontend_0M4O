import { Component, OnInit, Inject } from '@angular/core';
import { FuncionarioService } from '../../service/funcionario.service';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { UserDataService } from '../../service/user-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss']
})
export class FuncionarioComponent implements OnInit {
  
  funcionario = {} as any;
  matricula: any;
  nomefuncionario: any;
  
  userGestor = true;
  loading = false;

  exibirdados = false;

  constructor(private user: UserDataService, private funcionarioService: FuncionarioService, 
    private emitirEventoService: EmitirEventoService,private _avRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userGestor = this.hasPermission('srf_userAdm');
    if( ! this.userGestor ){
      this.obterDadosFuncionario(this.user.matricula());
    }
    this.matricula = this._avRoute.snapshot.queryParamMap.get("matricula");
    this.nomefuncionario = this._avRoute.snapshot.queryParamMap.get("nome");
    if(this.matricula && this.nomefuncionario ){
      this.funcionario.codigoDominio = this.matricula;
      this.funcionario.nome = this.nomefuncionario;
      this.obterDadosFuncionario(this.matricula);
    }
   
    
  }

  hasPermission(permission) {
    return this.user.hasPermission(permission);
  }

  /**
   * Ao informar a matrícula, o sistema busca da api os dados do funcionário
   * @param event 
   */
  buscar(event) {
    if( event.target.value ){
      if(event.target.value){
        this.obterDadosFuncionario(event.target.value); 
      }
    }

  }

  obterDadosFuncionario(matricula){
    this.loading = true;
    this.funcionarioService.getBy(matricula, "matricula").subscribe(map=>{
      if ( map ){
        this.funcionario = map;
        this.funcionario.codigoDominio = map.matricula;
        this.emitirEventoService.emitir("funcionario", this.funcionario);
        this.loading = false;
        this.exibirdados = true;
      }
    }, erros =>{
      this.funcionario = {} as any;
      let msg = "Nenhum funcionário encontrado";
      if( erros.error.message ){
        msg = erros.error.message;
      }
      HelperFrequencia.showNotification(msg, AlertType.Error);
      this.loading = false;
      this.exibirdados = false;
    }); 

  }

}
