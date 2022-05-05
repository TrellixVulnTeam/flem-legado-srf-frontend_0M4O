import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { BancoDeHorasService } from 'app/service/banco-de-horas.service';
import { ExportarDominioService } from 'app/service/exportar-dominio.service';
import { FileService } from 'app/service/file.service';
import { UserDataService } from 'app/service/user-data.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HelperFrequencia } from './../helper/helper-frequencia';
import { AlertType } from './../model/alert-type';
import { ExcelService } from 'app/service/excel.service';
import { DialogCompetenciaComponent } from 'app/dialog/dialog-competencia/dialog-competencia.component';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { DialogHistoricoExportarDominioComponent } from 'app/dialog/dialog-historico-exportar-dominio/dialog-historico-exportar-dominio.component';

@Component({
  selector: 'app-exportar-dominio',
  templateUrl: './exportar-dominio.component.html',
  styleUrls: ['./exportar-dominio.component.scss']
})
export class ExportarDominioComponent implements OnInit {

  tipoexportacao =
    [
      {
        descricao: '0040 - FALTAS MÊS ATUAL',
        valor: '0040/EXPORTAR_FALTAS'
      },
      {
        descricao: '0314 - FALTAS MÊS ANTERIOR',
        valor: '0314/EXPORTAR_FALTAS'
      }
      // ,
      // {
      //   descricao: 'DETALHAMENTO GERAL DE FALTAS POR COMPETÊNCIA',
      //   valor: '0000/DETALHAMENTO_FALTAS'
      // }
      //,
      // {
      //   descricao : '8069 - HORAS FALTAS - SEG a SEX',
      //   valor : '8069/HORAS_FALTAS'
      // },
      // {
      //   descricao : '0100 - HORAS EXTRAS 50% - SEG a SEX',
      //   valor : '0100/HORAS_EXTRAS_50'
      // },
      // {
      //   descricao : '0100 - HORAS EXTRAS 50% - SÁB',
      //   valor : '0100/HORAS_EXTRAS_50'
      // },
      // {
      //   descricao : '0200 - HORAS EXTRAS 100% - DOM e FERIÁDOS',
      //   valor : '0200/HORAS_EXTRAS_100'
      // },
      // {
      //   descricao : '0000 - DESCONTO TICKET POR FALTAS - SEG a SEX',
      //   valor : '0000/DESCONTO_TICKET_FALTAS'
      // },
      // {
      //   descricao : '0000 - DESCONTO TRANSPORTE POR FALTAS - SEG a SEX',
      //   valor : '0000/DESCONTO_TRANSPORTE_FALTAS'
      // }
    ]

  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  form: FormGroup;
  situacoes = [];
  loading: boolean = false;
  loadingexportacoes: boolean = false;
  dados = new MatTableDataSource();
  checkedList = [];
  frequencias = [];
  displayedColumns: string[] = [];
  columnNames;
  codProjeto = null;
  codProjetoRetorno: any;

  checked: boolean = false;
  filteredProjects: Observable<string[]>;
  myControl = new FormControl();
  selection: any;
  checkedListRetorno = [];
  projetos: any[];
  pageIndex: number = 0;
  selectedId: number = 0;

  exportacoesDominio: any[] = [];
  exportacaoDisplayedColumns: string[] = [];
  exportacaoColumnNames = [
    { id: 'id', value: 'Código' },
    { id: 'dataexportacao', value: 'Data Exportação' },
    { id: 'nomefuncionarioresponsavel', value: 'Funcionário Responsável' },
    { id: 'tipoexportacao', value: 'Tipo Exportação' },
    { id: 'rublica', value: 'Rública de Importação' },
    { id: 'competenciadados', value: 'Mês Faltas' },
    { id: 'competenciafolha', value: 'Mês Desconto' },
    { id: 'projetos', value: 'Projetos' },
    { id: 'fileNameExportacao', value: 'Exportação Domínio' },
    { id: 'fileNameDetalhamento', value: 'Detalhamento' },
    { id: 'regularizar', value: 'Regularizar' },
    { id: 'dsr', value: 'DSR' },
    { id: 'regularizacao', value: 'Referência' },
    { id: 'delete', value: 'Excluir' }
  ];

  dataSourceExportacao = new MatTableDataSource<any[]>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  itemsPerPageLabel = 'Registros por Página';
  nextPageLabel = 'Próximo';
  previousPageLabel = 'Anterior';
  firstPageLabel = 'Primeira Página';
  lastPageLabel = 'Última Página';

  constructor(private _exportarDominioService: ExportarDominioService,
    private _fileService: FileService,
    public dialog: MatDialog,
    private emitirEventoService: EmitirEventoService,
    private _user: UserDataService,
    private _service: BancoDeHorasService,
    private excelService: ExcelService) {
    this.columns();
  }

  ngOnInit() {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj) {
        this.getTypeEmiter(obj);
      }
    });
    this._buildForm();
    this.carregarProjetos();
    this.carregarExportacoes(null);
  }

  getTypeEmiter(obj) {
    if (obj.type === 'competencia') {
      this.gerarPagamentoFaltasRegularizadas(obj.data)
    }
    return false;
  }

  carregarExportacoes(regularizacao) {
    this.loadingexportacoes = true;
    this._exportarDominioService.getListExportacoes().subscribe(item => {
      this.carregarGridExportacoes(item);
      this.loading = false;
      this.loadingexportacoes = false;
      if (regularizacao) {
        HelperFrequencia.showNotification('Regularização gerada com sucesso!', AlertType.Success);
      }
    });
  }

  carregarGridExportacoes(item) {
    this.exportacoesDominio = item;
    this.dataSourceExportacao = new MatTableDataSource(this.exportacoesDominio);
    this.dataSourceExportacao.paginator = this.paginator;
    this.dataSourceExportacao.sort = this.sort;
    this.loadingexportacoes = false;
    this.loading = false;
  }

  columns() {
    this.exportacaoDisplayedColumns = this.exportacaoColumnNames.map(x => x.id);
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      'mesanodados': new FormControl(''),
      'mesanofolha': new FormControl(''),
      'tipoexportacao': new FormControl(''),
      'rubricas': new FormControl('')
    });

  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  codigoProjetoSelecionado() {
    let i = 0;
    let ids = [];
    this.checkedList.forEach(item => {
      if (item) {
        if (item.codigoDominio) {
          ids[i] = item.codigoDominio;
        } else if (!item.codigoDominio) {
          ids[i] = item
        }
        i++;
      }
    });
    if (ids.length == 0) {
      ids = null;
    }
    return ids;
  }

  exportAsXLSX(data, name): void {

    let dados = [];
    data.data.forEach(item => {
      dados.push({ Matricula: item.matricula, Nome: item.nome, Municipio: item.municipio, Situacao: item.situacao });
    });
    this.excelService.exportAsExcelFile(dados, name);

  }

  validarCampos(): string {

    if (this.form.controls['mesanodados'].value && this.form.controls['mesanofolha'].value) {
      let mesanodados = this.form.controls['mesanodados'].value.split('/');
      let mesanofolha = this.form.controls['mesanofolha'].value.split('/');

      if ((mesanofolha[1] + mesanofolha[0]) < (mesanodados[1] + mesanodados[0])) {
        return "Mês Ano Referência de Dados não pode ser maior que Mês Ano Desconto em Folha."
      }
    }

    if (!this.form.controls['tipoexportacao'].value
      || !this.form.controls['mesanodados'].value
      || !this.form.controls['mesanofolha'].value
      || (this.checkedList != null && this.checkedList.length == 0)) {
      return "Preencha todos os filtros para geração do arquivo."
    }

    return "";
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  objetoPesquisa() {

    let codProjeto = this.splitCodProjeto();
    if (!codProjeto) {
      codProjeto = this.codProjetoStr()
    }

    let obj = {
      competenciadados: this.form.controls['mesanodados'].value != "" ? this.form.controls['mesanodados'].value : null,
      competenciafolha: this.form.controls['mesanofolha'].value != "" ? this.form.controls['mesanofolha'].value : null,
      tipoexportacao: this.form.controls['tipoexportacao'].value.split("/")[1],
      rublica: this.form.controls['tipoexportacao'].value.split("/")[0],
      projetos: codProjeto
    }
    return obj;
  }

  splitCodProjeto() {
    let array = null;
    if (this.codProjetoRetorno) {
      array = [];
      array = this.codProjetoRetorno.split(",");
    }
    return array;
  }

  codProjetoStr(): string {
    this.codProjeto = [];
    this.codProjeto = this.codigoProjetoSelecionado();
    let idStr: string = null;
    let i = 0;
    if (this.codProjeto) {
      this.codProjeto.forEach(item => {
        if (i > 0) {
          idStr += ", " + item;
        } else {
          idStr = item;
        }
        i++;
      });
    }
    return idStr;
  }

  carregarProjetos() {
    this._service.projetosExternos().subscribe(projetos => {
      this.projetos = projetos;
      this.filteredProjects = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });
  }

  marcarDesmarcar() {
    if (this.checked)
      this.limparTodos();
    else
      this.marcarTodos();
  }

  limparTodos() {
    this.checked = false;
    this.checkedList = [];
    this.checkedListRetorno = [];
  };

  marcarTodos() {
    this.checked = true;
    this.checkedList = [];
    for (var i = 0; i < this.projetos.length; i++) {
      this.checkedList.push(this.projetos[i]);
    }
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projetos.filter(option => option.nome.toLowerCase().includes(filterValue));
  }


  onCheckboxChange(option, event) {
    const checkedAux = this.checkedList;
    if (event.target.checked) {
      for (let i = 0; i < this.projetos.length; i++) {
        for (let j = 0; j < checkedAux.length; j++) {
          if (this.projetos[i].codigoDominio == checkedAux[j]) {
            this.checkedList.push(this.projetos[i]);
          }
        }
      }
      this.checkedList.push(option);
    } else {
      for (let i = 0; i < this.projetos.length; i++) {
        if ((this.checkedList[i] == option) || (this.checkedList[i] == option.codigoDominio)) {
          this.checkedList.splice(i, 1);
        }
      }
    }
  }

  projetosSelecionados(obj) {
    for (let i = 0; i < this.checkedListRetorno.length; i++) {
      if (obj.codigoDominio == this.checkedListRetorno[i]) {
        return true;
      }
    }
    return false;
  }

  openDialogCompetencia(id): void {
    this.selectedId = id;
    const dialogRef = this.dialog.open(DialogCompetenciaComponent, {
      width: '600px',
      data: {
        id: id
      }
    });
  }

  gerarExportacao() {
    this.loading = true;
    this.loadingexportacoes = true;
    let mensagem = this.validarCampos();
    if (mensagem.length == 0) {
      this._exportarDominioService.save(this.objetoPesquisa()).subscribe(item => {
        this.carregarExportacoes(null);
        HelperFrequencia.showNotification('Exportação gerada com sucesso!', AlertType.Success);
        this.loading = false;
        this.loadingexportacoes = false;
      }, erro => {
        HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
        this.loading = false;
        this.loadingexportacoes = false;
      });
    } else {
      this.loading = false;
      this.loadingexportacoes = false;
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    }
  }

  gerarRegularizacaoFaltas(id) {
    console.log(id)
    this.loading = true;
    this.loadingexportacoes = true;
    this._exportarDominioService.regularizacaoFaltas(id).subscribe(item => {
      this.carregarExportacoes(null);
      HelperFrequencia.showNotification('Regularização gerada com sucesso!', AlertType.Success);
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  gerarPagamentoFaltasRegularizadas(competencia) {
    this.loading = true;
    this.loadingexportacoes = true;

    // let obj = {
    //   id: this.selectedId,
    //   competencia: competencia
    // }
    if (competencia == 'sucesso') {
      this.carregarExportacoes(competencia);
    } else {
      this.loading = false;
      this.loadingexportacoes = false;
    }
    // console.log(obj)

    // this._exportarDominioService.pagamentoFaltasRegularizadas(obj).subscribe(item => {
    //   this.carregarExportacoes();
    //   HelperFrequencia.showNotification('Regularização gerada com sucesso!', AlertType.Success);
    //   this.loading = false;
    //   this.loadingexportacoes = false;
    // }, erro => {
    //   HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
    //   this.loading = false;
    //   this.loadingexportacoes = false;
    // });
  }

  gerarDsrFaltas(id) {
    console.log(id)
    this.loading = true;
    this.loadingexportacoes = true;
    this._exportarDominioService.dsrFaltas(id).subscribe(item => {
      this.carregarExportacoes(null);
      HelperFrequencia.showNotification('Desconto DSR de faltas gerado com sucesso!', AlertType.Success);
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  delete(id: any) {

    if (window.confirm('Tem certeza que você quer apagar este item?')) {
      this.loading = true;
      this.loadingexportacoes = true;
      this._exportarDominioService.delete(id).subscribe(
        (data) => {
          this.carregarGridExportacoes(data);
          HelperFrequencia.showNotification("Exportação Excluida com sucesso", AlertType.Success);
          this.loadingexportacoes = false;
        },
        error => {
          HelperFrequencia.showNotification("Erro ao excluir", AlertType.Error);
          this.loadingexportacoes = false;
        }
      )
    }
  }

  gerarRegularizacaoDsrFaltas(id) {
    console.log(id)
    this.loading = true;
    this.loadingexportacoes = true;
    this._exportarDominioService.regularizacaoDsrFaltas(id).subscribe(item => {
      this.carregarExportacoes(true);
     // HelperFrequencia.showNotification('Regularização de DSR de faltas gerado com sucesso!', AlertType.Success);
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  gerarPagamentoRegularizacaoDsrFaltas(id) {
    console.log(id)
    this.loading = true;
    this.loadingexportacoes = true;
    this._exportarDominioService.pagamentoRegularizacaoDsrFaltas(id).subscribe(item => {
      this.carregarExportacoes(true);
     // HelperFrequencia.showNotification('Regularização de DSR de faltas gerado com sucesso!', AlertType.Success);
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  DownloadTXT(id, filename) {
    this._fileService.downloadFileExportacao(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      // const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = filename;
      a.click();
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  DownloadFileExportacao(id, filename) {
    this._fileService.downloadFileExportacao(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = filename;
      a.click();
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  DownloadFileDetalhamento(id, filename) {
    this._fileService.downloadFileDetalhamento(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = filename;
      a.click();
      this.loading = false;
      this.loadingexportacoes = false;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.loadingexportacoes = false;
    });
  }

  applyFilterExportacaoDominio(value) {
    this.dataSourceExportacao.filter = value.trim().toLowerCase();
  }

  openDialogHistorico(): void {
    const dialogRef = this.dialog.open(DialogHistoricoExportarDominioComponent, {
      width: '900px',
      data: {
        history: this._exportarDominioService.getHistory()
      }
    });
  }
}