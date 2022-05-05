import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeriasService } from 'app/service/ferias.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AlertType } from 'app/model/alert-type';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { take } from 'rxjs/operators';
import { ExcelService } from 'app/service/excel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogHistoricoFeriasComponent } from 'app/dialog/dialog-historico-ferias/dialog-historico-ferias.component';
import { UserDataService } from 'app/service/user-data.service';
import { DialogUploadArquivoFeriasComponent } from 'app/dialog/dialog-upload-arquivo-ferias/dialog-upload-arquivo-ferias.component';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';

@Component({
  selector: 'app-administrar-ferias',
  templateUrl: './administrar-ferias.component.html',
  styleUrls: ['./administrar-ferias.component.scss']
})
export class AdministrarFeriasComponent implements OnInit {

  public form: FormGroup;
  public comboSituacao = [];
  public displayedColumns: string[] = [];
  public columnNames;
  public dados = new MatTableDataSource();
  public ferias = [];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public loading: boolean = false;
  public checkedList = [];
  public mostrarPesquisa: boolean = false;
  public pageIndex: number = 0;
  public codProjeto = null;
  public codProjetoRetorno: any;
  public retorno;
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public isRadioValueInicial: string = '3';
  public loadingZip: boolean = false;
  

  constructor(private _service: FeriasService,
    private _emitirEventoService: EmitirEventoService,
    private _excelService: ExcelService,
    private _router: Router,
    private datePipe: DatePipe,
    private _avRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _user: UserDataService,
    private _arquivos: ArquivosFeriasService
  ) { }

  ngOnInit() {
    this._buildForm();
    this.getComboSituacao();
    this.obterProjetosSelecionados();
    this.columns();
    this.getParams();

  }
  valueRadioInicial() {
    this.form.controls['anexo'].patchValue(this.isRadioValueInicial);
  }


  private _buildForm(): void {
    this.form = new FormGroup({
      'situacao': new FormControl(''),
      'matricula': new FormControl(''),
      'mesAnoInicio': new FormControl(''),
      'mesAnoFim': new FormControl(''),
      'anexo': new FormControl(''),
      'aviso': new FormControl(''),
      'recibo': new FormControl(''),
      'compPagto': new FormControl('')
    });
  }

  getParams() {
    this.retorno = this._avRoute.snapshot.queryParamMap.get("retorno");
    if (this.retorno) {
      if (this._avRoute.snapshot.queryParamMap.get("matricula")) {
        this.setFieldFormControl('matricula', this._avRoute.snapshot.queryParamMap.get("matricula"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("codProjetoPesquisa")) {
        this.codProjetoRetorno = this._avRoute.snapshot.queryParamMap.get("codProjetoPesquisa");
        this.checkedList = this.splitCodProjeto();
      }
      if (this._avRoute.snapshot.queryParamMap.get("matricula")) {
        this.setFieldFormControl('matricula', this._avRoute.snapshot.queryParamMap.get("matricula"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("pageIndex")) {
        this.pageIndex = Number(this._avRoute.snapshot.queryParamMap.get("pageIndex"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("situacao")) {
        this.setFieldFormControl('situacao', this._avRoute.snapshot.queryParamMap.get("situacao"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("mesAnoInicio")) {
        this.setFieldFormControl('mesAnoInicio', this._avRoute.snapshot.queryParamMap.get("mesAnoInicio"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("mesAnoFim")) {
        this.setFieldFormControl('mesAnoFim', this._avRoute.snapshot.queryParamMap.get("mesAnoFim"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("anexo")) {
        this.setFieldFormControl('anexo', this._avRoute.snapshot.queryParamMap.get("anexo"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("aviso")) {
        this.setFieldFormControl('aviso', this._avRoute.snapshot.queryParamMap.get("aviso"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("recibo")) {
        this.setFieldFormControl('recibo', this._avRoute.snapshot.queryParamMap.get("recibo"));
      }
      if (this._avRoute.snapshot.queryParamMap.get("compPagto")) {
        this.setFieldFormControl('compPagto', this._avRoute.snapshot.queryParamMap.get("compPagto"));
      }
      this.pesquisar();
    } else {
      this.valueRadioInicial();
    }

  }

  getComboSituacao(): void {

    let array = [];
    this._service.getSituacao().pipe(take(1)).subscribe(item => {
      array = item;
      for (let i = 0; i < array.length; i++) {
        this.comboSituacao[i] = array[i];
      }
    });
    this.comboSituacao[2] = { descSituacaoFerias: 'Todas', situacao: 'TODAS' };
  }

  columns() {
    this.columnNames = [
      { id: 'matricula', value: 'Matrícula' },
      { id: 'funcNome', value: 'Nome' },
      { id: 'projeto', value: 'Projeto' },
      { id: 'dataInicio', value: 'Inicio' },
      { id: 'dataFim', value: 'Fim' },
      { id: 'diasDireito', value: 'Dias de direito' },
      { id: 'diasGozo', value: 'Dias de gozo' },
      { id: 'dataRetorno', value: 'Retorno' },
      { id: 'situacaoDescricao', value: 'Situação' },
      { id: 'acao', value: 'Ação' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }


  pesquisar() {

    let obj = this.getObj();
    // console.log(obj)
    if (this.validForm(obj)) {
      HelperFrequencia.showNotification("Por favor preencha um dos filtros => Matrícula, Situação, Mês Ano Inicio, Mês Ano Fim ou Arquivos Enviados", AlertType.Error);
      return false;
    } else {
      this.loading = true;
    }
    if (!this.isPeriodoValido(obj)) {
      this.loading = false;
      HelperFrequencia.showNotification("A data fim não pode ser maior que data inicio!", AlertType.Error);
      return false;
    }

    this._service.pesquisarFerias(obj).subscribe(item => {
      this.ferias = item;
      this.dados = new MatTableDataSource(item);
      this.dados.sort = this.sort;
      this.dados.paginator = this.paginator;
      this.loading = false;
      this.mostrarPesquisa = true;
    }, erro => {
      console.log(erro)
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.mostrarPesquisa = false;
    });
  }

  obterProjetosSelecionados(): void {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj.type == 'projetos') {
        this.checkedList = obj.data;
      }
    });
  }

  getSituacao() {
    let situacao = this.form.controls['situacao'].value;
    if (situacao == 'TODAS' || situacao == '') {
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

  exportAsXLSX() {
    let dados = [];
    this.ferias.forEach(i => {
      dados.push({
        "Matrícula": i.matricula,
        "Nome": i.funcNome,
        "Projeto": i.projeto,
        "Inicio": i.dataInicio,
        "Fim": i.dataFim,
        "Dias de gozo": i.diasGozo,
        "Dias de direito": i.diasDireito,
        "Retorno": i.dataRetorno,
        "Situação": i.situacao
      });
    });
    this._excelService.exportAsExcelFile(dados, "ferias");
  }

  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }


  validForm(obj) {
    if (!obj.matricula
      && !this.form.controls['situacao'].value
      && !obj.projetos
      && !obj.mesAnoInicio
      && !obj.mesAnoFim
      && !this.form.controls['aviso'].value
      && !this.form.controls['recibo'].value
      && !this.form.controls['compPagto'].value) {
      return true;
    } else {
      return false;
    }

  }

  arquivos(element) {
    let codProjeto = null;
    let codProjetoStr = this.codProjetoStr();
    if (!this.codProjetoRetorno && this.codProjetoRetorno == codProjetoStr) {
      codProjeto = this.codProjetoRetorno;
    } else {
      codProjeto = codProjetoStr;
    }

    this._router.navigate(['ferias/arquivos-ferias/' + element.id], {
      queryParams: {
        id: element.id,
        matricula: element.matricula,
        matriculaPesquisa: this.form.controls['matricula'].value,
        nome: element.funcNome,
        pageIndex: this.pageIndex,
        admFerias: true,
        situacao: this.form.controls['situacao'].value,
        codProjeto: element.idProjeto,
        codProjetoPesquisa: codProjeto,
        mesAnoInicio: this.form.controls['mesAnoInicio'].value,
        mesAnoFim: this.form.controls['mesAnoFim'].value,
        anexo: this.form.controls['anexo'].value,
        aviso: this.form.controls['aviso'].value,
        recibo: this.form.controls['recibo'].value,
        compPagto: this.form.controls['compPagto'].value,
      },
      skipLocationChange: true
    });

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

  splitCodProjeto() {
    let array = null;
    array = [];
    if (this.codProjetoRetorno) {
      if (this.codProjetoRetorno.indexOf(",") != -1) {
        array = this.codProjetoRetorno.split(",");
      } else {
        array.push(this.codProjetoRetorno);
      }
    }
    return array;
  }

  setFieldFormControl(field, value) {
    this.form.controls[field].patchValue(value)
  }

  getObj() {
    let obj = {} as any;
    obj.matricula = this.form.controls['matricula'].value;
    obj.mesAnoInicio = this.form.controls['mesAnoInicio'].value != "" ? this.form.controls['mesAnoInicio'].value : null;
    obj.mesAnoFim = this.form.controls['mesAnoFim'].value != "" ? this.form.controls['mesAnoFim'].value : null;
    obj.possuiArquivo = this.getRadio();
    obj.situacao = this.getSituacao();
    obj.aviso = this.form.controls['aviso'].value;
    obj.recibo = this.form.controls['recibo'].value;
    obj.compPagto = this.form.controls['compPagto'].value;

    if (this.retorno && this.codProjetoRetorno) {
      obj.projetos = this.checkedList;
    } else {
      obj.projetos = this.codigoProjetoSelecionado();
    }
    return obj;
  }

  getRadio() {
    let anexo = this.form.controls['anexo'].value;
    switch (anexo) {
      case '1':
        return 'S'
      case '2':
        return 'N'
      case '3':
        return null;
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

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  isPeriodoValido(obj): boolean {
    if (obj.mesAnoInicio && obj.mesAnoFim) {
      let anoInicio = obj.mesAnoInicio.substring(3, 7);
      let anoFim = obj.mesAnoFim.substring(3, 7)
      if (anoInicio == anoFim) {
        let mesInicio = obj.mesAnoInicio.substring(0, 1);
        let mesFim = obj.mesAnoFim.substring(0, 1);
        if (Number(mesFim) < Number(mesInicio)) {
          return false;
        }
      }
    }
    return true;
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
      a.download = "relatorioAvisoFerias." + type[1];
      a.click();
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification('Não existem registros a serem impressos !', AlertType.Error);
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
      a.download = "relatorioReciboFerias." + type[1];
      a.click();
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification('Não existem valores a serem impressos.!', AlertType.Error);
    });
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


  baixarEmLote() {
    this.loadingZip = true;
    let obj = this.getObj();
    if (!obj.mesAnoInicio && !obj.mesAnoFim && !this.baixarEmLote) {
      HelperFrequencia.showNotification("Por favor informe o Mês Ano Inicio ou Mês Ano Fim!", AlertType.Error);
      this.loadingZip = false;
      return false;
    }
    this._service.downloadFrequenciasZip(obj).subscribe(response => {
      let a = document.createElement('a');
      let blob = new Blob([response], { 'type': "application/zip" });
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "arquivos.zip";
      a.click();
      this.loadingZip = false;
      this._service.clearFilesZip().pipe(take(1)).subscribe();
    }, erro => {
      this.loadingZip = false;
      if(!obj.mesAnoInicio && !obj.mesAnoFim){
        HelperFrequencia.showNotification("Por favor informe o mês ano inicio ou mês ano fim!", AlertType.Error);
      }else{
        HelperFrequencia.showNotification("Erro ao baixar os arquivos de férias", AlertType.Error);
      }
      
    });
  }

}
