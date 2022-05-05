import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserDataService } from '../../service/user-data.service';
import { DialogFolhaPontoComponent } from '../../dialog/dialog-folha-ponto/dialog-folha-ponto.component';
import { FrequenciaService } from '../../service/frequencia.service';
import { MatDialog } from '@angular/material';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { FileService } from '../../service/file.service';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bt-acao',
  templateUrl: './bt-acao.component.html',
  styleUrls: ['./bt-acao.component.scss']
})
export class BtAcaoComponent implements OnInit {

  @Input('frequencia') frequencia;
  @Input('enableAnexo') enableAnexo;
  @Input('isFolhaValidada') isFolhaValidada
  @Input('id') idFrequencia;
  @Input('isDisponibilizar') isDisponibilizar = true;
  @Input('isCodProjetoSaeb') isCodProjetoSaeb;
  @Input('isGeracaoAutomatica')isGeracaoAutomatica;
  situacaoFrequencia: any;

  @Output() updateGrid = new EventEmitter();

  isVoltar: any = false;
  matricula: any;
  matriculaPesquisa: any;
  competencia: any;
  competenciaPesquisa: any;
  codProjetoPesquisa: any;
  anexo: any;
  pageIndex: any;
  situacaoFuncionario: any;


  constructor(private frequenciaService: FrequenciaService, public dialog: MatDialog, private user: UserDataService,
    private fileService: FileService, private emitirEventoService: EmitirEventoService,
    private _avRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj.data == 'anexada') {
        this.enableAnexo = true;
      }
    });
    this.preencheCamposNavigate();
  }

  hasPermission(permission) {
    return this.user.hasPermission(permission);
  }

  /**
  * Dialog para anexar e imprimir Folha de Ponto
  */
  openDialogFolhaPonto(): void {

    const dialogRef = this.dialog.open(DialogFolhaPontoComponent, {
      width: '800px',
      data: {
        id: this.idFrequencia
      }
    });
  }

  downloadPDF() {
    this.frequenciaService.downloadPDF(this.idFrequencia).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "frequencia." + type[1];
      a.click();

    });
  }
  downloadAnexo() {
    this.frequenciaService.downloadAnexo(this.idFrequencia).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "frequencia." + type[1];
      a.click();
    });
  }

  downloadFrequencia() {
    this.fileService.downloadFileFrequencia(this.idFrequencia).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "frequencia." + type[1];
      a.click();
    }, error => {
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }

  /**
   * Método que valida frequência
   */
  validarFrequencia(): void {
    this.frequenciaService.validarFrequencia(this.idFrequencia).subscribe(response => {
      this.isFolhaValidada = response.validado;
      this.isDisponibilizar = response.idDisponibilizada;
      this.atualizarGrid();
      HelperFrequencia.showNotification("Frequência validada com sucesso!", AlertType.Success);
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  disponibilizarFolha(): void {
    this.frequenciaService.disponiblizarFolha(this.idFrequencia).pipe(take(1)).subscribe(response => {
      this.isDisponibilizar = true;
      this.isFolhaValidada = true;
      HelperFrequencia.showNotification("Frequência disponibilizada com sucesso!", AlertType.Success);
    }, error => {
      let mensagem = error.error.message;
      if (!mensagem) {
        mensagem = "Erro sistema está sem internet!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  atualizarGrid() {
    this.updateGrid.emit("update");
  }

  preencheCamposNavigate() {
    this.matricula = this._avRoute.snapshot.queryParamMap.get("matricula");
    this.matriculaPesquisa = this._avRoute.snapshot.queryParamMap.get("matriculaPesquisa");
    this.isVoltar = this._avRoute.snapshot.queryParamMap.get("voltar");
    this.competencia = this._avRoute.snapshot.queryParamMap.get("competencia");
    this.competenciaPesquisa = this._avRoute.snapshot.queryParamMap.get("competenciaPesquisa");
    this.situacaoFrequencia = this._avRoute.snapshot.queryParamMap.get("situacaoFrequencia");
    this.codProjetoPesquisa = this._avRoute.snapshot.queryParamMap.get("codProjetoPesquisa");
    this.anexo = this._avRoute.snapshot.queryParamMap.get("anexo");
    this.pageIndex = this._avRoute.snapshot.queryParamMap.get("pageIndex");
    let codProjeto = this._avRoute.snapshot.queryParamMap.get("codProjeto");
    this.situacaoFuncionario = this._avRoute.snapshot.queryParamMap.get("situacaoFuncionario");
    if (Number(codProjeto) == 1000) {
      this.isCodProjetoSaeb = true;
    }
  }

  voltar() {
    this._router.navigate(['/frequencia'], {
      queryParams: {
        matricula: this.matriculaPesquisa,
        competencia: this.competenciaPesquisa,
        situacaoFrequencia: this.situacaoFrequencia,
        codProjeto: this.codProjetoPesquisa,
        returnADMF: true,
        anexo: this.anexo,
        pageIndex: this.pageIndex,
        returnUrl: this._router.url,
        situacaoFuncionario:  this.situacaoFuncionario
      },
      skipLocationChange: true
    });
  }



}
