import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogDownloadArquivoFeriasComponent } from 'app/dialog/dialog-download-arquivo-ferias/dialog-download-arquivo-ferias.component';
import { DialogHistoricoFeriasComponent } from 'app/dialog/dialog-historico-ferias/dialog-historico-ferias.component';
import { DialogUploadArquivoFeriasComponent } from 'app/dialog/dialog-upload-arquivo-ferias/dialog-upload-arquivo-ferias.component';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { ExcelService } from 'app/service/excel.service';
import { FeriasService } from 'app/service/ferias.service';
import { UserDataService } from 'app/service/user-data.service';


@Component({
  selector: 'app-ferias',
  templateUrl: './ferias.component.html',
  styleUrls: ['./ferias.component.scss']
})
export class FeriasComponent implements OnInit {

  public displayedColumns: string[] = [];
  public columnNames;
  public dados = new MatTableDataSource();
  public loading: boolean = false;
  public pesquisaAtiva: boolean = false;
  public lista = [];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public matricula;
  pageIndex: number = 0;


  constructor(private _service: FeriasService,
    private _user: UserDataService,
    private _emitirEventoService: EmitirEventoService,
    private _dialog: MatDialog,
    private _excelService: ExcelService,
    private _arquivos: ArquivosFeriasService,
    private _router: Router,
    private _avRoute: ActivatedRoute) { }

  ngOnInit() {
    const matricula = this._user.matricula();
    if (!this.hasPermission('acessoRH') && !this.hasPermission('coordenadorSRH')) {
      this.matricula = this._user.matricula();
      this.getList(matricula);
    }
    this.columns();
    this.getEmmiter();
    this.getParams();
  }

  habilitarAviso(element): boolean {
    if (this.hasPermission('srf_userAdm')) {
      return true;
    } else if (element.possuiArquivo == 'S') {
      return true;
    } else if (element.aviso) {
      return true;
    }
    return false;
  }


  getEmmiter() {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj) {
        if (obj.type === 'funcionario') {
          this.matricula = obj.data.codigoDominio;

        } else if (obj.type == 'upload') {
          this.matricula = obj.data;
        }
        this.getList(this.matricula);
      }
    });
  }

  getList(matricula) {
    if(matricula){
      this._service.getList(matricula).subscribe(item => {
        this.lista = item;
        this.dados = new MatTableDataSource(this.lista);
        this.dados.sort = this.sort;
        this.dados.paginator = this.paginator;
        this.pesquisaAtiva = true;
      }, erro => {
        this.pesquisaAtiva = false;
        HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      });
    }
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  columns() {
    this.columnNames = [
      { id: 'dataInicio', value: 'Inicio' },
      { id: 'dataFim', value: 'Fim' },
      { id: 'diasDireito', value: 'Dias de direito' },
      { id: 'diasGozo', value: 'Dias de gozo' },
      { id: 'dataRetorno', value: 'Retorno' },
      { id: 'situacao', value: 'Situação' },
      { id: 'acao', value: 'Ação' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }


  uploadFerias(element) {
    const dialogRef = this._dialog.open(DialogUploadArquivoFeriasComponent, {
      width: '800px',
      data: {
        id: element.id,
        dataInicio: element.dataInicio,
        dataFim: element.dataFim,
        matricula: element.matricula,
        arquivos: this._arquivos.getListTiposArquivos(element.id)
      }
    });
  }

  downloadFerias(element) {
    const dialogRef = this._dialog.open(DialogDownloadArquivoFeriasComponent, {
      width: '800px',
      data: {
        id: element.id,
        dataInicio: element.dataInicio,
        dataFim: element.dataFim,
        matricula: element.matricula,
        arquivos: this._arquivos.getListTiposArquivos(element.id)
      }
    });
  }


  exportAsXLSX() {
    let dados = [];
    this.lista.forEach(i => {
      dados.push({
        "Inicio": i.dataInicio,
        "Fim": i.dataFim,
        "Retorno": i.dataRetorno,
        "Dias": i.dias,
        "Situação": this.getStatusDescricao(i.situacao),
        "Baixou Arquivo": i.possuiArquivo == 'S' ? 'Sim' : 'Não'
      });
    });
    this._excelService.exportAsExcelFile(dados, "ferias");

  }

  gerarRelatorioAviso(id): void {
    this.loading = true;
    this._service.downloadRelatorioAvisoFerias(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "aviso_ferias." + type[1];
      a.click();
      console.log(this.matricula);
      this.getList(this.matricula);
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification('Não existem registros a serem impressos !', AlertType.Error);
    });
  }

  arquivos(element) {
    this._router.navigate(['ferias/arquivos-ferias/' + element.id], {
      queryParams: {
        matricula: this.matricula,
        nome: element.funcNome,
        pageIndex: this.pageIndex
      },
      skipLocationChange: true
    });
  }

  getParams() {
    if (this._avRoute.snapshot.queryParamMap.get("matricula")
      && this._avRoute.snapshot.queryParamMap.get("retorno")) {
      this.matricula = this._avRoute.snapshot.queryParamMap.get("matricula");
      this.getList(this.matricula);
    }
    if (this._avRoute.snapshot.queryParamMap.get("pageIndex")) {
      this.pageIndex = Number(this._avRoute.snapshot.queryParamMap.get("pageIndex"));
    }
  }

  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }

  getStatusDescricao(tipo): string {
    switch (tipo) {
      case 'APROVADO':
        return 'Aprovado'
      case 'REPROVADO':
        return 'Reprovado'
    }
  }

  historico(id) {
    const dialogRef = this._dialog.open(DialogHistoricoFeriasComponent, {
      width: '900px',
      data: {
        history: this._service.obterHistorico(id)
      }
    });
  }

  gerarRelRecibo(id): void {
    this.loading = true;
    this._service.downloadRelatorioReciboFerias(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "recibo_ferias." + type[1];
      a.click();
      this.getList(this.matricula);
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification('Não existem valores a serem impressos.!', AlertType.Error);
    });
  }

}
