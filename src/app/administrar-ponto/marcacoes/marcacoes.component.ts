import { Component, OnInit, Input } from '@angular/core';
import { UserDataService } from '../../service/user-data.service';
import { MatDialog } from '@angular/material';
import { DialogHistoricoAdministrarPontoComponent } from '../../dialog/dialog-historico-administrar-ponto/dialog-historico-administrar-ponto.component';
import { MarcacoesService } from '../../service/marcacoes.service';
import { AbonoService } from '../../service/abono.service';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { DialogAprovarMarcacaoComponent } from '../../dialog/dialog-aprovar-marcacao/dialog-aprovar-marcacao.component';
import { Marcacao } from '../../model/marcacao';
import { DialogConfirmComponent } from '../../dialog/dialog-confirm/dialog-confirm.component';
import { FrequenciaService } from '../../service/frequencia.service';
import { DialogReprovarMarcacoesComponent } from '../../dialog/dialog-reprovar-marcacoes/dialog-reprovar-marcacoes.component';
import { FileService } from '../../service/file.service';
import { first } from 'rxjs/operators';
import { DialogAprovarReprovarAbonoComponent } from 'app/dialog/dialog-aprovar-reprovar-abono/dialog-aprovar-reprovar-abono.component';

@Component({
  selector: 'app-marcacoes',
  templateUrl: './marcacoes.component.html',
  styleUrls: ['./marcacoes.component.scss']
})
export class MarcacoesComponent implements OnInit {

  @Input('frequencia') frequencia;
  @Input('maskTime') maskTime;
  @Input('isFolhaValidada') isFolhaValidada;
  @Input('idFrequencia') idFrequencia;
  enableField;

  constructor(public dialog: MatDialog, private user: UserDataService,
    private fileService: FileService,
    private marcacao: Marcacao, private frequenciaService: FrequenciaService,
    private marcacoesService: MarcacoesService, private abonoService: AbonoService) { }

  ngOnInit() {

  }

  /**
  * Metodo que habilita e desabilita o os input
  * @param tipo 
  * @param isFolhaValidada 
  */
  isEnableInput(tipo, isFolhaValidada): boolean {
    if (isFolhaValidada) {
      this.isFolhaValidada = true;
      return true;
    } else if (tipo != 'NORMAL' && !isFolhaValidada) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Metodo que habilita e desabilita o excluir marcações
   * @param tipo 
   * @param isFolhaValidada 
   */
  isEnableExcluir(tipo, isFolhaValidada): boolean {
    if (this.hasPermission('removeRegFreq')) {
      if (isFolhaValidada) {
        return false;
      } else if (tipo == 'NORMAL' && ( isFolhaValidada == null || !isFolhaValidada)) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  hasPermission(permission) {
    return this.user.hasPermission(permission);
  }

  getDescTipoMovimento(entrada, saida): string {
    if (entrada && !saida) {
      return entrada.tipoMvtoDesc;
    } else if (!entrada && saida) {
      return entrada.tipoMvtoDesc;
    } else if (entrada && saida && entrada.tipoMvtoDesc == saida.tipoMvtoDesc) {
      return entrada.tipoMvtoDesc;
    } else if (entrada && saida) {
      return entrada.tipoMvtoDesc + " / " + saida.tipoMvtoDesc;
    }
  }

  openDialogHistorico(item) {
    const idDia = item.id;
    if (item && item.id) {
      this.dialog.open(DialogHistoricoAdministrarPontoComponent, {
        width: '1000px',
        data: {
          history: this.marcacoesService.getHistory(idDia),
          historyAbono: this.abonoService.getHistory(idDia),
          dataDia: item.dataDia
        }
      });
    }
  }

  /**
 * Salva os horários quando tira o foco 
 * e recarrega a pesquisa
 * @param obj 
 * @param horaMarcacao 
 * @param idDia 
 * @param dataMarcacao 
 */
  changeSalvarHorarios(obj, marcacao, dataDia) {
    if (this.validarMarcacoes(obj)) {
      if (marcacao) {
        this.marcacao = this.preencherMarcacao(marcacao, dataDia);
        this.marcacoesService.saveMarcacao(this.marcacao).subscribe(val => {
          HelperFrequencia.showNotification('Marcação atualizado com Sucesso!', AlertType.Success);
        }, error => {
          HelperFrequencia.showNotification("Internal Server Error", AlertType.Error);
        });
      }
    }
  }

  /**
  * Valida a marcações
  * @param obj 
  */
  validarMarcacoes(obj) {
    if (obj.hrEntrada && obj.hrSaida) {
      let horaInicio = obj.hrEntrada.horaMarcacao;
      let horaSaida = obj.hrSaida.horaMarcacao;
      let horaIni;
      let horaSom;
      let hrIni;
      let hrFim;
      let minIni;
      let minFim;

      if (horaInicio) {
        horaIni = horaInicio.split(':');
        hrIni = parseInt(horaIni[0], 10);
        minIni = parseInt(horaIni[1], 10)
      } else {
        hrIni = 0;
      }
      if (horaSaida) {
        horaSom = horaSaida.split(':');
        hrFim = parseInt(horaSom[0], 10);
        minFim = parseInt(horaSom[1], 10)
      } else {
        hrIni = 0;
      }
      if (hrIni > hrFim) {
        HelperFrequencia.showNotification("A data de inicio não pode ser maior que a data fim!", AlertType.Error);
        return false;
      }
      if (hrIni == hrFim && minIni == minFim) {
        HelperFrequencia.showNotification("Macações iguais!", AlertType.Error);
        return false;
      }

    }
    return true;

  }

  /**
   * Abre o modal de aprovação
   * @param objHrEntrada 
   * @param objHrSaida 
   * @param idDia 
   * @param dataDia 
   */
  openDialogAprovar(marcacoes, dataDia): void {
    const dialogRef = this.dialog.open(DialogAprovarMarcacaoComponent, {
      width: '600px',
      data: {
        marcacoes: marcacoes,
        dataDia: dataDia,
        //idFrequencia:this.frequencia
        all: false
      }
    });
  }

  // preenche o obj marcação 
  public preencherMarcacao(obj, dataDia): Marcacao {
    let m = new Marcacao();
    m.id = obj.id;
    m.dataMarcacao = dataDia + " " + obj.horaMarcacao;
    m.usuarioAtualizacao = this.user.matricula();
    return m;
  }

  /**
* Dialog para remover a marcação
* @param id 
*/
  openDialogConfirm(id): void {

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        id: id,
        marcacao: true
      }
    });
  }

  /**
   * Dialog para remover a marcação
   * @param id 
   */
  openDialogAprovarAbono(obj): void {
    const dialogRef = this.dialog.open(DialogAprovarReprovarAbonoComponent, {
      width: '500px',
      data: {
        obj: obj,
        rh: true
      }
    });
  }

  /**
 * Dialog para remover a marcação
 * @param id 
 */
  openDialogAprovarAtestadoOrOutrasFaltas(obj): void {
    const dialogRef = this.dialog.open(DialogAprovarReprovarAbonoComponent, {
      width: '500px',
      data: {
        obj: obj,
        rh: false,
        idFrequencia: this.idFrequencia
      }
    });
  }

  // habilita o campo paa edição 
  habilitarMarcacoes(tipo): boolean {
    if (tipo == 'Em Atraso' || tipo == 'Atestado') {
      return false;
    } else {
      return true;
    }
  }
  // habilita o icone remover
  habilitarRemoverMarcacoes(tipo): boolean {
    if (tipo == 'Em Atraso' || tipo == 'Atestado') {
      return true;
    } else {
      return false;
    }
  }

  downloadAnexoAbono(idAnexo) {

    this.fileService.downloadFileAtestado(idAnexo).pipe(first()).subscribe(response => {

      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "atestado." + type[1];
      a.click();

    });
  }

  /**
   * @param marcacoes 
   * @param dataDia 
   */
  openDialogReprovar(marcacao, dataDia): void {
    const dialogRef = this.dialog.open(DialogReprovarMarcacoesComponent, {
      width: '600px',
      data: {
        marcacao: marcacao,
        dataDia: dataDia,
        observacao: null
      }
    });
  }

}
