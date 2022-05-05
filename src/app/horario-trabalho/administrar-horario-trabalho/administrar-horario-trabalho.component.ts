import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { HorarioTrabalhoService } from 'app/service/horario-trabalho.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { ExcelService } from 'app/service/excel.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { UserDataService } from 'app/service/user-data.service';
import { DialogAprovarReprovarAnexoFolhaComponent } from 'app/dialog/dialog-aprovar-reprovar-anexo-folha/dialog-aprovar-reprovar-anexo-folha.component';
import { DialogHistoricoArquivoJornadaComponent } from 'app/dialog/dialog-historico-arquivo-jornada/dialog-historico-arquivo-jornada.component';

@Component({
  selector: 'app-administrar-horario-trabalho',
  templateUrl: './administrar-horario-trabalho.component.html',
  styleUrls: ['./administrar-horario-trabalho.component.scss']
})
export class AdministrarHorarioTrabalhoComponent implements OnInit {

  public newForm: FormGroup;
  public comboSituacao = [];
  public horarios = [];
  public columnNames;
  public displayedColumns: string[] = [];
  public checkedList = [];
  public dados = new MatTableDataSource();
  public loading: boolean = false;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public mostrarPesquisa: boolean = false;
  public pageIndex: number = 0;

  constructor(private _service: HorarioTrabalhoService,
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
      if (obj.type == 'projetos') {
        this.checkedList = obj.data;
      }
      if (obj.type == 'aprovar-reprovar') {
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
    this.comboSituacao[3] = { descSituacaoHorario: 'Todas', situacao: 'TODAS' };
  }

  columns() {
    this.columnNames = [
      { id: 'matricula', value: 'Matrícula' },
      { id: 'nome', value: 'Nome' },
      { id: 'projeto', value: 'Projeto' },
      { id: 'descSituacaoHorario', value: 'Situação' },
      { id: 'id', value: 'Ação' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  pesquisar() {
    let obj = this.getObj();
    // console.log(obj)
    if (this.validForm(obj)) {
      HelperFrequencia.showNotification("Por favor preencha um dos filtros!", AlertType.Error);
      return false;
    } else {
      this.loading = true;
    }
    this._service.pesquisarHorarios(obj).subscribe(item => {
      this.horarios = item;
      // console.log(item)
      this.dados = new MatTableDataSource(item);
      this.dados.sort = this.sort;
      this.dados.paginator = this.paginator;
      this.mostrarPesquisa = true;
      this.loading = false;
    }, erro => {
      // console.log(erro)
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


  download(item) {
    item.loading = true;
    this._service.downloadFile(item.id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "horario." + type[1];
      a.click();
      item.loading = false;
    }, error => {
      item.loading = false;
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }

  aprovar(item) {
    this.openDialog(item, true);
  }

  reprovar(item) {
    this.openDialog(item, false);
  }


  openDialog(item, aprovar) {
    // item.observacao = null;
    const dialogRef = this._dialog.open(DialogAprovarReprovarAnexoFolhaComponent, {
      width: '600px',
      data: {
        obj: item,
        aprovar: aprovar
      }
    });
  }

  exportAsXLSX() {
    let dados = [];
    this.horarios.forEach(i => {
      dados.push({
        "Matricula": i.matricula,
        "Nome": i.nome,
        "descSituacaoHorario": i.projeto,
        "dataAtualizacao": i.descSituacaoHorario
      });
    });
    this._excelService.exportAsExcelFile(dados, "horarios");
  }

  historico(id) {
    const dialogRef = this._dialog.open(DialogHistoricoArquivoJornadaComponent, {
      width: '900px',
      data: {
        history: this._service.obterHistorico(id)
      }
    });
  }

  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }
  

}
