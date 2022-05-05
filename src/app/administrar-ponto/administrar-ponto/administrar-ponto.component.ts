import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { DialogAprovarMarcacaoComponent } from '../../dialog/dialog-aprovar-marcacao/dialog-aprovar-marcacao.component';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { FrequenciaService } from '../../service/frequencia.service';
import { UserDataService } from '../../service/user-data.service';
import { DialogObservacaoAssinaturaFrequenciaComponent } from 'app/dialog/dialog-observacao-assinatura-frequencia/dialog-observacao-assinatura-frequencia.component';



@Component({
  selector: 'app-administrar-ponto',
  templateUrl: './administrar-ponto.component.html',
  styleUrls: ['./administrar-ponto.component.scss']
})
export class AdministrarPontoComponent implements OnInit {

  frequencia = [];
  frequenciaList = [];
  public maskTime = [/\d/, /\d/, ':', /\d/, /\d/];
  enableField: boolean = false;
  idFrequencia: number;
  enableAnexo: boolean;
  isFolhaValidada: boolean = false;
  isDisponibilizar: boolean = true;
  isCodProjetoSaeb: boolean = false;
  situacaoFrequencia: any;
  isGeracaoAutomatica:boolean = false;

  loading = false;
  fileUrl;
  matricula: any;
  competencia: any;
  isVoltar: any;

  totalHorasTrabalhadas: any;

  selectedValue: any;

  constructor(private frequenciaService: FrequenciaService,
    private user: UserDataService,
    public dialog: MatDialog,
    private emitirEventoService: EmitirEventoService,
    private _avRoute: ActivatedRoute) { }

  ngOnInit() {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj) {
        this.getTypeEmiter(obj);
      }
    });
    if (!this.hasPermission('acessoRH') && !this.hasPermission('coordenadorSRH')) {
      const matricula = this.user.matricula();
      this.frequencias(matricula);
    }
    this.isVoltar = this._avRoute.snapshot.queryParamMap.get("voltar");
    if (this.isVoltar) {
      this.buscarFrequenciaQueryparam();
      this.enableField = true;
      // console.log(this.enableField);
    }

  }

  /** defiene o tipo de refresh */
  getTypeEmiter(obj) {
    if (obj.type === 'funcionario') {
      this.frequencias(obj.data.codigoDominio);
    } else if (obj.data === 'remover'
      || obj.data === 'dialogAprovar'
      || obj.data === 'dialogReprovar'
      || obj.data === 'abono') {
      this.carregarGrid();
      this.enableField = true;
    }
    return false;
  }

  /**
   * Carrega lista da tela principal 
   */
  frequencias(matricula) {
    this.frequenciaService.getFrequencias(matricula).subscribe(item => {
      this.frequenciaList = item;
    });
    this.frequencia = [];
  }

  marcacoes(event) {
    this.idFrequencia = event.value.id;
    this.isFolhaValidada = event.value.validado != null ? event.value.validado : false;
    this.isDisponibilizar = event.value.idDisponibilizada == null ? false : true;
    this.enableAnexo = event.value.fileNameFrequencia == null ? false : true;
    this.isCodProjetoSaeb = this.isCodigoSaeb(event.value.codProjeto);
    this.situacaoFrequencia = event.value.situacaoFrequencia;
    this.isGeracaoAutomatica =  event.value.geracaoAutomatica;
    this.carregarGrid();
    if (this.frequencia) {
      this.enableField = true;
    }
  }

  hasPermission(permission) {
    return this.user.hasPermission(permission);
  }
  // carrega a grid principal
  carregarGrid(): void {
    if (this.idFrequencia) {
      this.loading = true;
      this.frequenciaService.getDiasByFrequencia(this.idFrequencia).pipe(take(1)).subscribe(item => {
        this.frequencia = item;
        // console.log(this.frequencia);
        this.loading = false;
        this.calcularTotalHorasTrabalhadas();
      });

    }
  }

  enableValidarLote(): boolean {
    const temAcesso = this.hasPermission('validarRegFreq');
    return (temAcesso && this.enableField && !this.isFolhaValidada);
  }

  /**
   * Aprovar marcações em lote
   */
  openDialogAprovarLote(): void {
    const dialogRef = this.dialog.open(DialogAprovarMarcacaoComponent, {
      width: '600px',
      data: {
        all: true,
        frequencias: this.frequencia
      }
    });
  }

  atualizarGrid(event) {
    this.carregarGrid();
  }

  calcularTotalHorasTrabalhadas() {
    if (this.frequencia && this.frequencia.length > 0) {
      this.totalHorasTrabalhadas = this.frequencia.filter(item => item.horasTrabalhadas).reduce((a, b) => a + b.horasTrabalhadas, 0)
    }
  }

  buscarFrequenciaQueryparam() {
    this.matricula = this._avRoute.snapshot.queryParamMap.get("matricula");
    this.competencia = this._avRoute.snapshot.queryParamMap.get("competencia");
    if (this.matricula && this.competencia) {
      this.frequenciaService.getFrequencias(this.matricula).subscribe(item => {
        this.frequenciaList = item;
        this.frequenciaList.forEach(i => {
          if (i.mesAnoFrequencia == this.competencia) {
            this.selectedValue = i;
            this.idFrequencia = i.id;
            this.isFolhaValidada = i.validado != null ? i.validado : false;
            this.isDisponibilizar = i.idDisponibilizada == null ? false : true;
            this.isGeracaoAutomatica = i.isGeracaoAutomatica != null ? i.isGeracaoAutomatica : true;
            this.enableAnexo = i.fileNameFrequencia == null ? false : true;
            this.situacaoFrequencia = i.situacaoFrequencia;
            this.carregarGrid();
          }
        });
      });
    }
  }

  isCodigoSaeb(cod): boolean {
    return cod == 1000
  }

  openDialogObservacaoFrequencia() {
    // console.log(this.idFrequencia);
    let observacao = null;
    const dialogRef = this.dialog.open(DialogObservacaoAssinaturaFrequenciaComponent, {
      width: '600px',
      data: {
        id: this.idFrequencia,
        getObservacao: this.frequenciaService.getObservacaoNaoAssinada(this.idFrequencia),
        observacao: observacao
      }
    });
  }

  enableNaoAssinatura(): boolean {
    return (this.enableField && !this.isFolhaValidada);
  }

}
