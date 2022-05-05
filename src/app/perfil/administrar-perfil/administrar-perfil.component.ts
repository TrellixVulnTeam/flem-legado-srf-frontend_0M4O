import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { DadosFuncionarioService } from 'app/service/dados-funcionario.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { ExcelService } from 'app/service/excel.service';
import { UserDataService } from 'app/service/user-data.service';
import { take } from 'rxjs/operators';
import { DialogPendenciaComponent } from 'app/dialog/dialog-pendencia/dialog-pendencia.component';

@Component({
  selector: 'app-administrar-perfil',
  templateUrl: './administrar-perfil.component.html',
  styleUrls: ['./administrar-perfil.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AdministrarPerfilComponent implements OnInit {


  public newForm: FormGroup;
  public comboSituacao = [];
  public pendencia = [];
  public columnNames;
  public displayedColumns: string[] = [];
  public checkedList = [];
  public dados = new MatTableDataSource();
  public loading: boolean = false;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public mostrarPesquisa: boolean = false;
  public pageIndex: number = 0;

  constructor(private _service: DadosFuncionarioService,
    private _emitirEventoService: EmitirEventoService,
    private _excelService: ExcelService,
    private _user: UserDataService,
    private _dialog: MatDialog) { }

  ngOnInit() {
    this.getEmiter();
    this.buildForm();
    this.getComboSituacao();
    this.columns();
  }

  getEmiter(): void {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj.type === 'projetos') {
        this.checkedList = obj.data;
      }
      if (obj.type === 'aprovar-reprovar') {
        this.pesquisar();
      }
    });
  }

  buildForm() {
    this.newForm = new FormGroup({
      'matricula': new FormControl(''),
      'situacao': new FormControl('')
    });
  }

  getComboSituacao(): void {
    let array = [];
    this._service.getSituacao().pipe(take(1)).subscribe(item => {
      array = item;
      for (let i = 0; i < array.length; i++) {
        this.comboSituacao[i] = array[i];
      }
    });
    this.comboSituacao[3] = 'TODAS';
  }

  columns() {
    this.columnNames = [
      { id: 'matricula', value: 'Matrícula' },
      { id: 'nome', value: 'Nome' },
      { id: 'departamentoNome', value: 'Projeto' },
      { id: 'id', value: 'Visualizar Pendências' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  pesquisar() {
    let obj = this.getObj();
    if (this.validForm(obj)) {
      HelperFrequencia.showNotification("Por favor preencha um dos filtros!", AlertType.Error);
      return false;
    } else {
      this.loading = true;
    }
    this._service.pesquisarDadosAlterados(obj).subscribe(item => {
      this.pendencia = item;
      console.log(item)
      this.dados = new MatTableDataSource(item);
      this.dados.sort = this.sort;
      this.dados.paginator = this.paginator;
      this.mostrarPesquisa = true;
      this.loading = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
    });
  }

  getObj() {
    let obj = {} as any;
    obj.matricula = this.newForm.controls['matricula'].value;
    obj.situacao = this.getSituacao();
    obj.projetos = this.codigoProjetoSelecionado();
    return obj;
  }

  getSituacao() {
    let situacao = this.newForm.controls['situacao'].value;
    if (!situacao || situacao == 'TODAS') {
      return null;
    } else {
      return situacao;
    }
  }
  codigoProjetoSelecionado() {
    let i = 0;
    let ids = [];
    this.checkedList.forEach(item => {
      if (item) {
        if (item.codigoDominio) {
          ids[i] = item.codigoDominio;
          i++;
        }
      }
    });
    if (ids.length == 0) {
      ids = null;
    }
    return ids;
  }


  validForm(obj) {
    if (!obj.matricula
      && !this.newForm.controls['situacao'].value
      && !obj.projetos) {
      return true;
    } else {
      return false;
    }

  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }


  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  
  exportAsXLSX() {
    let dados = [];
    this.pendencia.forEach(i => {
      dados.push({
        'id': i.id,
        'Matricula': i.matricula,
        'Nome': i.nome,
        'departamentoNome': i.departamentoNome,
      });
    });
    this._excelService.exportAsExcelFile(dados, 'pendencias');
  }

  
  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }


  abrirPendencia(item) {
    const dialogRef = this._dialog.open(DialogPendenciaComponent, {
      width: '1280px',
      data: {
        service: this._service.pesquisarDadosAlterados({matricula: item.funcionario.matricula, situacao: this.getSituacao()}),
        columns: this.carregarColunasPendencia(),
      }
    });
    dialogRef.afterClosed().subscribe(x => {
      this.pesquisar();
     });
  }

  carregarColunasPendencia() {
    return   [
       { id: 'status', value: 'Situação' },
       { id: 'valor', value: 'Alteração' },
       { id: 'label', value: 'Tipo Pendência' },
       { id: 'descricao', value: 'Descrição' },
       { id: 'id', value: 'Ação' },
     ];
   }

   contarPendenciasAbertas(item){
     let dd = [];
    if (item.pendenciaComprovante) {
      dd = dd.concat(item.pendenciaComprovante);
    }
    if (item.pendenciaEmail) {
      dd = dd.concat(item.pendenciaEmail);
    }
    if (item.pendenciaTelefone) {
      dd = dd.concat(item.pendenciaTelefone);
    }
    let info = [0,0,0];
    dd.forEach((x)=> {
      if (x.status == 'ABERTO')
        info[0] ++;
      if (x.status == 'APROVADO')
        info[1] ++;
      if (x.status == 'REPROVADO')
        info[2] ++;   
    });
    return info[0] +' ABERTAS / ' + info[1] +' APROVADAS / '+ info[2] +' REPROVADAS';
   }
}

