import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MarcacoesService } from '../../service/marcacoes.service';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';

import { AdministrarPontoComponent } from '../../administrar-ponto/administrar-ponto/administrar-ponto.component';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { TipoMovimento } from '../../model/tipoMovimento';
import { Marcacao } from '../../model/marcacao';
import { UserDataService } from '../../service/user-data.service';
import { AbonoService } from '../../service/abono.service';

@Component({
  selector: 'app-dialog-aprovar-marcacao',
  templateUrl: './dialog-aprovar-marcacao.component.html',
  styleUrls: ['./dialog-aprovar-marcacao.component.scss']
})
export class DialogAprovarMarcacaoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogAprovarMarcacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private marcacoesService: MarcacoesService,
    private emitirEventoService: EmitirEventoService,
    private user: UserDataService,
    private abonoService: AbonoService) { }

  obj: any = {};
  private hrEntrada;
  private hrSaida;
  loading = false;


  ngOnInit() {
    if (this.data.marcacoes) {
      if (this.data.marcacoes.hrEntrada) {
        this.hrEntrada = this.data.marcacoes.hrEntrada.horaMarcacao;
      }
      if (this.data.marcacoes.hrSaida) {
        this.hrSaida = this.data.marcacoes.hrSaida.horaMarcacao;
      }
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  aprovar(): void {
    this.approveOrDisapproveAdd(true);
  }

  aprovarEmLote(): void {
    this.loading = true;
    let frequencias = this.data.frequencias;
    let observacao = this.data.observacao;
    let marcacaoEntrada = new Marcacao();
    let marcacaoSaida = new Marcacao();
    let listaMarcacoes = [];
    let listaAbonos = [];

    for (let i = 0; i < frequencias.length; i++) {
      if (frequencias[i].marcacoes) {
        for (let y = 0; y < frequencias[i].marcacoes.length; y++) {
          marcacaoEntrada = this.preencherMarcacoes(frequencias[i].marcacoes[y].hrEntrada, frequencias[i].dataDia);
          marcacaoSaida = this.preencherMarcacoes(frequencias[i].marcacoes[y].hrSaida, frequencias[i].dataDia);
          listaMarcacoes.push(marcacaoEntrada);
          listaMarcacoes.push(marcacaoSaida);
        }
      }
      if (frequencias[i].abonos && frequencias[i].abonos.length > 0) {
        for (let j = 0; j < frequencias[i].abonos.length; j++) {
          frequencias[i].abonos[j].hrTrabalhadas = null;
          frequencias[i].abonos[j].observacao = this.data.observacao;
          listaAbonos.push(frequencias[i].abonos[j]);
        }

      }
    }
    this.obj.tipo = 'Aprovadas';
    this.obj.pathLocal = "validadas";
    this.validarMarcacoesEmLote(frequencias,listaMarcacoes, listaAbonos);
  }

  reprovar() {
    if (!this.data.marcacoes.observacao) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação!", AlertType.Error);
      return false;
    } else {
      this.approveOrDisapproveAdd(false);
    }

  }

  preencherMarcacoes(obj, dataDia): Marcacao {
    let marc = new Marcacao();
    if (obj && obj.id) {
      marc.id = obj.id;
      marc.dataMarcacao = dataDia + " " + obj.horaMarcacao;
      marc.observacao = this.data.observacao;
      marc.usuarioValidador = this.user.matricula();
      marc.usuarioAtualizacao = this.user.matricula();
    }
    return marc;
  }

  approveOrDisapproveAdd(validado): void {
    let hrEntrada = this.data.marcacoes.hrEntrada;
    let hrSaida = this.data.marcacoes.hrSaida;
    let marcacaoEntrada = new Marcacao();
    let marcacaoSaida = new Marcacao();
    let marcacoes = [];
    if (hrEntrada && hrEntrada.id) {
      marcacaoEntrada = this.preencherMarcacoes(hrEntrada, this.data.dataDia);
      marcacoes.push(marcacaoEntrada);
    }
    if (hrSaida && hrSaida.id) {
      marcacaoSaida = this.preencherMarcacoes(hrSaida, this.data.dataDia);
      marcacoes.push(marcacaoSaida);
    }
    //  console.log(marcacaoEntrada, marcacaoSaida);

    if (validado) {
      this.obj.tipo = 'aprovadas';
      this.obj.pathLocal = "validadas";
    } else {
      this.obj.tipo = 'reprovadas';
      this.obj.pathLocal = "reprovadas";
    }
    this.enviar(marcacoes);

  }

  enviar(marcacoes): void {
    this.marcacoesService.approveOrDisapprove(marcacoes, this.obj.pathLocal).subscribe(val => {
      HelperFrequencia.showNotification('Marcações ' + this.obj.tipo + ' com Sucesso!', AlertType.Success);
      this.emitirEventoService.emitir("dialogAprovar", "dialogAprovar");
      this.onNoClick();
    }, error => {
      let msg = error.error.message;
      if (!msg) {
        msg = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(msg, AlertType.Error);
    });
  }


  enviarMarcacoesLote(marcacoes, abonos): void {
    this.marcacoesService.approveOrDisapprove(marcacoes, this.obj.pathLocal).subscribe(val => {
      this.enviarAbonosEmLote(abonos);
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification("Ocorreu um erro inesperado!", AlertType.Error);
    });
  }

  enviarAbonosEmLote(abonos): void {
    this.abonoService.approveOrDisapproveList(abonos).subscribe(val => {
      HelperFrequencia.showNotification('Marcações Aprovadas com Sucesso!', AlertType.Success);
      this.emitirEventoService.emitir("dialogAprovar", "dialogAprovar");
      this.onNoClick();
    }, error => {
      HelperFrequencia.showNotification("Ocorreu um erro inesperado!", AlertType.Error);
    });
  }

  validarMarcacoesEmLote(frequencias,marcacoes, abonos) {
    let id;
    frequencias.forEach(element => {
      if (element.idFrequencia) {
        id = element.idFrequencia;
      }
    });
    this.marcacoesService.verificarInconsistencia(id).subscribe(val => {
      this.enviarMarcacoesLote(marcacoes, abonos);
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    })
  }

}

