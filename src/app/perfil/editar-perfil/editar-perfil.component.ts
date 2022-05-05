import { Component, OnInit, ViewChild } from '@angular/core';
import { DadosFuncionarioService } from 'app/service/dados-funcionario.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { FuncionarioService } from 'app/service/funcionario.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DialogPendenciaComponent } from 'app/dialog/dialog-pendencia/dialog-pendencia.component';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {
  public  funcionario = {} as any;
  public matricula: number;
  public selectedFiles: FileList
  public currentFileUpload: File;
  public lista = [];
  public listaAtiva: boolean;
  public isAnexou = false;
  public isAlterar: boolean = false;
  public file: any;
  public maskTelefone = ['(',/\d/, /\d/, ')', ' ',/\d/, /\d/, /\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]
  public maskCelular = ['(',/\d/, /\d/,')', /\d/,' ', /\d/, /\d/, /\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/,];
  public loading: boolean = false;

  
  constructor(private _service: DadosFuncionarioService,
    private _funcionarioervice: FuncionarioService,
    private _emitirEventoService: EmitirEventoService,
    private _dialog: MatDialog) { }

  ngOnInit() {
    this.emiter();

  }

  carregarDados(matricula) {
    this._funcionarioervice.getDadosRH(matricula).subscribe(item => {
      this.parseFuncionario(item);
    });
  }


  emiter() {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj) {
        this.getTypeEmiter(obj);
      }
    });
  }

  getTypeEmiter(obj) {
    if (obj.type === 'funcionario') {
      this.matricula = obj.data.codigoDominio;
      this.carregarDados(this.matricula)
    }
    return false;
  }

  AquivoUpload(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = event.target.files.item(0)
  }
  remover(index): void {
    this.lista.splice(index, 1);
    if (this.lista.length == 0) {
      this.listaAtiva = false;
      this.isAnexou = false;
    }
    this.limparFiles();
  }

  limparFiles() {
    this.selectedFiles = null;
    this.currentFileUpload = null;
  }

  alterar() {
    if (this.isAlterar) {
      this.isAlterar = false;
    } else {
      this.isAlterar = true;
    }
    this.limparFiles();
  }
  adicionar() {
    if (this.currentFileUpload) {
      if (!HelperFrequencia.extPermitidas(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification(HelperFrequencia.msgExtInvalidas, AlertType.Error);
        return false;
      }
      if (this.currentFileUpload.size > HelperFrequencia.getMaxSizeFile()) {
        HelperFrequencia.showNotification(HelperFrequencia.msgTamanhoInvalido, AlertType.Error);
        return false;
      }
      if (!HelperFrequencia.validarNomeArquivo(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification(HelperFrequencia.msgNomeInvalido(), AlertType.Error);
        return false;
      }
      let obj = {
        nome: this.currentFileUpload.name,
        arquivo: this.currentFileUpload,
      }
      this.listaAtiva = true;
      this.lista.push(obj);
      this.isAnexou = true;
    } else {
      HelperFrequencia.showNotification("Por favor seleciona um arquivo", AlertType.Error);
    }

  }
  enviar() {
    if (Object.keys(this.funcionario).length !== 0 || (Object.keys(this.funcionario).length !== 0  && this.isAnexou)) {
          this.loading = true;
      
          if(this.funcionario.telefone) {
            this.funcionario.telefone = this.funcionario.telefone.replace(/[^0-9]+/g,'');
          }
          if(this.funcionario.celular) {
            this.funcionario.celular = this.funcionario.celular.replace(/[^0-9]+/g,'');
          }
          
          
          this._service.uploadComprovanteEndereco(this.funcionario, this.currentFileUpload).subscribe(item => {
            HelperFrequencia.showNotification("Arquivo enviado com sucesso!", AlertType.Success);
            this.parseFuncionario(item);
            this.lista = [];
            this.currentFileUpload = null;
            this.listaAtiva = false;
            this.isAnexou = false;
            this.loading = false;
          }, error => {
            HelperFrequencia.showNotification(error.error.message, AlertType.Error);
            this.loading = false;
          });
        } else {
          HelperFrequencia.showNotification("É necessário preeencher algum campo", AlertType.Error);
        }

    }

    
  abrirPendencia(item) {
    const dialogRef = this._dialog.open(DialogPendenciaComponent, {
      width: '1280px',
      data: {
        service: this._service.pesquisarDadosAlterados({matricula: item.matricula, situacao:null}),
        columns: this.carregarColunasPendencia(),
      }
    });
  }

  carregarColunasPendencia() {
    return   [
       { id: 'status', value: 'Situação' },
       { id: 'valor', value: 'Alteração' },
       { id: 'label', value: 'Tipo Pendência' },
       { id: 'descricao', value: 'Descrição' },
       { id: 'dataAtualizacao', value: 'Atualizacao' },
       { id: 'id', value: 'Ação' },
     ];
   }

   parseFuncionario(item) {
    this.funcionario = {
      id: item.id,
      matricula: item.matricula,
      email: item.email,
      emailAlternativo: item.emailAlternativo,
      telefone: item.telefone,
      celular: item.celular,	
      descricao: item.descricao,
      projeto: item.departamentoCodigo,
      cidade: item.municipioResidencia,
      cep: item.cep,
      endereco: item.endereco,
      numeroEndereco: item.numeroEndereco,
      bairro: item.bairro,
      complemento: item.complemento,
      uf: item.uf
    };
   }
}
