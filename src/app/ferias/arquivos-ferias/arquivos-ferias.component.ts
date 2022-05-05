import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FeriasService } from 'app/service/ferias.service';
import { DialogHistoricoArquivoComponent } from 'app/dialog/dialog-historico-arquivo/dialog-historico-arquivo.component';
import { UserDataService } from 'app/service/user-data.service';
import { DatePipe } from '@angular/common';
import { DialogAprovarReprovarFeriasComponent } from 'app/dialog/dialog-aprovar-reprovar-ferias/dialog-aprovar-reprovar-ferias.component';



@Component({
  selector: 'app-arquivos-ferias',
  templateUrl: './arquivos-ferias.component.html',
  styleUrls: ['./arquivos-ferias.component.scss']
})
export class ArquivosFeriasComponent implements OnInit, OnDestroy {

  public arquivos = [];
  public newForm: FormGroup;
  public admferias;

  constructor(private _avRoute: ActivatedRoute,
    private _service: ArquivosFeriasService,
    private _router: Router,
    private _dialog: MatDialog,
    private _emitirEventoService: EmitirEventoService,
    private _feriasService: FeriasService,
    private _user: UserDataService,
    private _datePipe: DatePipe) { } 

  public id: number;
  public matricula;
  public matriculaPesquisa;
  public nome;
  public arquivos$: Observable<any[]>;
  public todos: boolean = false;
  public pageIndex;
  public situacao;
  public codProjetoPesquisa;
  public mesAnoInicio;
  public mesAnoFim;
  public anexo;
  public aviso;
  public compPagto;
  public recibo; 

  ngOnInit() {
    this.buildForm();
    this.getParams();
    this.getList();
    this.getEmmiter();
    // console.log(this._avRoute.snapshot.queryParamMap);
  }

  buildForm(): void {
    this.newForm = new FormGroup({
      'aprovar': new FormControl(''),
    });
  }

  getParams() {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    if (this._avRoute.snapshot.queryParamMap.get("matriculaPesquisa")) {
      this.matriculaPesquisa = this._avRoute.snapshot.queryParamMap.get("matriculaPesquisa");
    }
    if (this._avRoute.snapshot.queryParamMap.get("matricula")) {
      this.matricula = this._avRoute.snapshot.queryParamMap.get("matricula");
    }
    if (this._avRoute.snapshot.queryParamMap.get("nome")) {
      this.nome = this._avRoute.snapshot.queryParamMap.get("nome");
    }
    if (this._avRoute.snapshot.queryParamMap.get("pageIndex")) {
      this.pageIndex = this._avRoute.snapshot.queryParamMap.get("pageIndex");
    }
    if (this._avRoute.snapshot.queryParamMap.get("admFerias")) {
      this.admferias = this._avRoute.snapshot.queryParamMap.get("admFerias");
    }
    if (this._avRoute.snapshot.queryParamMap.get("situacao")) {
      this.situacao = this._avRoute.snapshot.queryParamMap.get("situacao");
    }
    if (this._avRoute.snapshot.queryParamMap.get("codProjetoPesquisa")) {
      this.codProjetoPesquisa = this._avRoute.snapshot.queryParamMap.get("codProjetoPesquisa");
    }
    if (this._avRoute.snapshot.queryParamMap.get("mesAnoInicio")) {
      this.mesAnoInicio = this._avRoute.snapshot.queryParamMap.get("mesAnoInicio");
    }
    if (this._avRoute.snapshot.queryParamMap.get("mesAnoFim")) {
      this.mesAnoFim = this._avRoute.snapshot.queryParamMap.get("mesAnoFim");
    }
    if (this._avRoute.snapshot.queryParamMap.get("anexo")) {
      this.anexo = this._avRoute.snapshot.queryParamMap.get("anexo");
    }
    if (this._avRoute.snapshot.queryParamMap.get("aviso")) {
      this.aviso = this._avRoute.snapshot.queryParamMap.get("aviso");
    }
    if (this._avRoute.snapshot.queryParamMap.get("recibo")) {
      this.recibo = this._avRoute.snapshot.queryParamMap.get("recibo");
    }
    if (this._avRoute.snapshot.queryParamMap.get("compPagto")) {
      this.compPagto = this._avRoute.snapshot.queryParamMap.get("compPagto");
    }
  }

  getList() {
    this.arquivos$ = this._service.getListArquivos(this.id);
  }

  getDescricao(tipo): string {
    switch (tipo) {
      case 'AVISO':
        return 'Aviso'
      case 'RECIBO':
        return 'Recibo'
      case 'COMP_PGTO':
        return 'Comprovante de Pagamento'
    }
  }


  voltar() {
    if (this.admferias) {
      this.voltarAdmferias();
    } else {
      this.voltarFerias()
    }
  }

  /**
   * retorna para tela de férias
   */
  voltarFerias() {
    this._router.navigate(['ferias'], {
      queryParams: {
        matricula: this.matricula,
        retorno: true,
        nome: this.nome,
        pageIndex: this.pageIndex
      },
      skipLocationChange: true
    });
  }
  /**
   * retorna para tela de Adm férias
   */
  voltarAdmferias() {
    this._router.navigate(['administrar-ferias'], {
      queryParams: {
        matricula: this.matriculaPesquisa,
        retorno: true,
        nome: this.nome,
        pageIndex: this.pageIndex,
        situacao: this.situacao,
        codProjetoPesquisa: this.codProjetoPesquisa,
        mesAnoInicio: this.mesAnoInicio,
        mesAnoFim: this.mesAnoFim,
        anexo: this.anexo,
        aviso: this.aviso,
        compPagto: this.compPagto,
        recibo: this.recibo,
      },
      skipLocationChange: true
    });
  }


  download(item) {
    this._service.downloadAnexo(item.idFerias, item.tipo).subscribe(response => {
      let nome: string = this.getDescricao(item.tipo);
      nome = nome.toLowerCase();
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = nome + "." + type[1];
      a.click();
    }, error => {
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }

  baixarTodos() {
    this._service.ziparArquivos(this.id).pipe(take(1)).subscribe(item => {
      this.downloadZip(item.value);
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }


  downloadZip(link) {
    this._service.downloadFilesZip(link).subscribe(response => {
      let a = document.createElement('a');
      let blob = new Blob([response], { 'type': "application/zip" });
      a.href = URL.createObjectURL(blob);
      a.download = "arquivos." + this._datePipe.transform(new Date(), 'ddMMyyyy') + ".zip";
      a.click();
      this.todos = true;
    }, erro => {
      HelperFrequencia.showNotification("Erro ao baixar os arquivos de férias", AlertType.Error);
    });
  }

  reprovar(element) {
   this.dialog(element,false);
  }

  aprovar(element) {
    this.dialog(element,true);
   }
 

  dialog(element, aprovar) {
    const dialogRef = this._dialog.open(DialogAprovarReprovarFeriasComponent, {
      width: '600px',
      data: {
        arquivos: this._service.getListArquivos(element.id),
        element: element,
        aprovar: aprovar
      }
    });
  }

  getStatusDescricao(tipo): string {
    switch (tipo) {
      case 'APROVADO':
        return 'Aprovado'
      case 'REPROVADO':
        return 'Reprovado'
    }
  }

  getEmmiter() {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj) {
        if (obj.type === 'aprovar-reprovar') {
          this.getList();
          this.atualizarSituacao();
        };
      }
    });
  }

  atualizarSituacao() {
    this._feriasService.atualizarSituacao(this.id).pipe(take(1)).subscribe(item => {
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  historico(id) {
    const dialogRef = this._dialog.open(DialogHistoricoArquivoComponent, {
      width: '800px',
      data: {
        history: this._service.obterHistorico(id)
      }
    });
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  ngOnDestroy() {
    if (this.todos) {
      this._service.clearFilesZip('zip').pipe(take(1)).subscribe();
    }
  }
}