import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FuncionarioService } from '../service/funcionario.service';
import { HelperFrequencia } from '../helper/helper-frequencia';
import { AlertType } from '../model/alert-type';
import { FileService } from '../service/file.service';
import { DatePipe } from '@angular/common';
import { EmitirEventoService } from '../service/emitir-evento.service';
import { DateHelper } from '../helper/dateHelper';
import { AbonoService } from '../service/abono.service';
import { JustificativasService } from '../service/justificativas.service';

@Component({
  selector: 'app-lancar-atestado',
  templateUrl: './lancar-atestado.component.html',
  styleUrls: ['./lancar-atestado.component.scss']
})

export class LancarAtestadoComponent implements OnInit {


  @ViewChild('fileInput') fileInput: ElementRef;

  newForm: FormGroup;
  funcionario = {} as any;
  minDate;

  selectedFiles: FileList
  currentFileUpload: File;
  justificativas = [];
  public maskTime = [/\d/, /\d/, ':', /\d/, /\d/];
  atestado = {} as any;
  enableGrid: boolean = false;

  loading = false;
  isDias: boolean = false;
  isDiasObr: boolean = true;

  constructor(private funcionarioService: FuncionarioService, private abonoService: AbonoService,
    private fileService: FileService, private datePipe: DatePipe,
    private emitirEventoService: EmitirEventoService,
    private justificativaService: JustificativasService) {

  }

  ngOnInit() {
    this.buildForm();
    this.getJustificativa();
    this.emiter();

  }

  emiter() {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj && obj.type === 'funcionario') {
        this.funcionario = obj.data;
      }
    });
  }

  /**
   * Ao informar data Inicio, a mesma passa a ser a data minima para a data Fim
   * @param event 
   */
  changeDataInicio(event) {
    this.minDate = event.target.value;
    this.newForm.controls['dataFim'].patchValue('');
    this.eventChangeDate(this.newForm.controls['justificativa'].value, this.minDate);
    // this.newForm.controls['dataFim'].patchValue(this.adicionarDiasData(dias));
    this.atestado = {};

  }
  /**
   * simula a inclusão de atestado
  */
  processar() {
    if (this.formIsValid()) {
      if (this.currentFileUpload) {
        if (!HelperFrequencia.extPermitidas(this.currentFileUpload.name)) {
          HelperFrequencia.showNotification(HelperFrequencia.msgExtInvalidas(), AlertType.Error);
          return false;
        }

        if (this.currentFileUpload.size > HelperFrequencia.getMaxSizeFile()) {
          HelperFrequencia.showNotification(HelperFrequencia.msgTamanhoInvalido(), AlertType.Error);
          return false;
        }

        if (!HelperFrequencia.validarNomeArquivo(this.currentFileUpload.name)) {
          HelperFrequencia.showNotification(HelperFrequencia.msgNomeInvalido(), AlertType.Error);
          return false;
        }
      }

      const data = this.newForm.value;

      const atestado = {} as any;
      atestado.dataInicio = this.datePipe.transform(data.dataInicio, 'dd/MM/yyyy');
      atestado.dataFim = data.dataFim;
      atestado.matricula = this.funcionario.codigoDominio;
      atestado.justificativa = data.justificativa;
      atestado.observacao = data.observacao;

      this.verificarSejutificativaEAbonodaOunao(data.justificativa);
      if (this.isJutificativaAnexo(data.justificativa)) {
        HelperFrequencia.showNotification("Esta justificativa exige um anexo!", AlertType.Error);
        return false;
      } else {
        this.fileService.processar(atestado).subscribe(map => {
          this.atestado = map;
          this.enableGrid = true;
        }, error => {
          HelperFrequencia.showNotification(error.error.message, AlertType.Error);
          if (this.qtdDiasValidos(data.justificativa, atestado.dataInicio, atestado.dataFim)) {
            this.atestado = {};
            this.enableGrid = false;
            return false;
          }
        });
      }
    }
  }

  /**
   * Salvar o atestado informado
   */
  confirmar() {

    if (this.formIsValid()) {
      this.loading = true;
      const data = this.newForm.value;
      const dataInicio = this.datePipe.transform(data.dataInicio, 'dd/MM/yyyy');
      const dataFim = data.dataFim;
      const matricula = this.funcionario.codigoDominio;
      this.fileService.uploadAtestado(this.currentFileUpload, dataInicio, dataFim, matricula, this.atestado).subscribe(atest => {
        HelperFrequencia.showNotification("Justificativa Ausência gerada com sucesso!", AlertType.Success);
        if (atest) {
          // this.abonoService.gerarAbonosFromAtestado(atest.id, this.atestado).subscribe(abono => {
          //   this.newForm.controls['dataInicio'].patchValue('');
          //   this.newForm.controls['dataFim'].patchValue('');
          //   this.newForm.controls['observacao'].patchValue('');
          //   this.newForm.controls['file'].patchValue('');
          this.enableGrid = false;
          this.loading = false;
          //   HelperFrequencia.showNotification("Justificativa Ausência gerada com sucesso!", AlertType.Success);
          // }, error => {
          this.loading = false;
          //   HelperFrequencia.showNotification(error.error.message, AlertType.Error);
          // })
        }
      }, error => {
        this.loading = false;
        let msg = "Erro ao salvar Registro";
        if (error.error) {
          msg = error.error.message
        }
        HelperFrequencia.showNotification(msg, AlertType.Error);

      })
    }

  }
  somarHorasAbonadas(horas) {
    let somatorio = 0;
    horas.forEach(hour => {
      const horaIni = DateHelper.obterHoraEmMinuto(hour.hrEntrada.horaMarcacao);
      const horaSom = DateHelper.obterHoraEmMinuto(hour.hrSaida.horaMarcacao);
      somatorio = somatorio + (horaSom - horaIni);
    });
    return DateHelper.obterHoraFormatada(somatorio);
  }
  /**
   * Somar horas informadas
   * @param horaInicio 
   * @param horaFim 
  */
  somarHoras(horaInicio, horaFim) {
    const horaIni = DateHelper.obterHoraEmMinuto(horaInicio);
    const horaSom = DateHelper.obterHoraEmMinuto(horaFim);
    return DateHelper.obterHoraFormatada(horaSom - horaIni);
  }

  removerIntervalo(i, dia) {
    dia.marcacoes.splice(i, 1);
  }

  /**
   * Preenche o objeto this.currentFileUpload com o arquivo carregado
   * @param event 
  */
  upload(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = event.target.files.item(0)
  }
  /**
   * Verifica se os dados foram informados e estão válidos, 
   * caso não estejam válidos, lança norificação na tela
   */
  formIsValid() {
    let msg = [];
    let valid = true;
    let dias = this.newForm.controls['dias'].value;
    if (!this.funcionario.nome) {
      valid = false;
      msg.push("Funcionário deve ser informado");
    }
    if (!this.newForm.valid) {
      valid = false;
      msg.push("Por favor preencher todos os campos obrigatórios!");
    }
    if (!this.newForm.valid && ( !dias && !this.isDias) ) {
      valid = false;
      msg.push("Por favor preencher todos os campos obrigatórios!");
    }
    if (!valid) {
      HelperFrequencia.showNotification(msg, AlertType.Error);
    }
    return valid;
  }
  /**
   * Constroi o formulário da tela
   */
  buildForm() {

    this.newForm = new FormGroup({
      'dataInicio': new FormControl('', Validators.required),
      'dataFim': new FormControl('', Validators.required),
      'justificativa': new FormControl('', Validators.required),
      'observacao': new FormControl('', Validators.required),
      'file': new FormControl(''),
      'dias': new FormControl(''),
      'getDias': new FormControl({ value: '', disabled: true })
    });
  }
  getJustificativa() {
    this.justificativaService.comboJustificativa().subscribe(item => {
      this.justificativas = item;
    });
  }

  verificarSejutificativaEAbonodaOunao(justificativa): void {
    this.justificativas.forEach(item => {
      if (item.id == justificativa && !item.abono) {
        HelperFrequencia.showNotification("Justificativa Ausência não abonada!", AlertType.Warning);
      }
    });
  }

  isJutificativaAnexo(justificativa): boolean {
    let is: boolean = false;
    this.justificativas.forEach(item => {
      if (item.id == justificativa && item.isAnexo && !this.currentFileUpload) {
        is = true;
      }
    });
    return is;
  }

  qtdDiasValidos(justificativa, data1, data2): boolean {
    let dias = this.dataDiff(data1, data2);
    let is: boolean = false;
    this.justificativas.forEach(item => {
      if (item.id == justificativa && dias > item.dias) {
        is = true;
      }
    });
    return is;
  }

  dataDiff(data1, data2) {
    data1 = data1.split("/");
    data2 = data2.split("/");
    let dif = Math.abs(parseInt(data1[0]) - parseInt(data2[0]));
    dif += Number(Math.abs(parseInt(data1[1]) * 30.41 - parseInt(data2[1]) * 30.41));
    dif += Number(Math.abs(parseInt(data1[2]) - parseInt(data2[2])) * 365);
    return dif;
  }

  adicionarDiasData(dias, dataInicio) {
    if (dataInicio) {
      let dataVenc = new Date(dataInicio.getTime() + (dias * 24 * 60 * 60 * 1000));
      return dataVenc;
    } else {
      return '';
    }
  }

  changeJustificativa(event) {
    this.eventChangeDate(event.value, this.newForm.controls['dataInicio'].value);
  }

  eventChangeDate(value, dataInicio) {
    let dias = this.newForm.controls['dias'].value;
    this.justificativas.forEach(item => {
      if (item.id == value) {
        if (item.dias) {
          this.newForm.controls['dataFim'].patchValue(this.datePipe.transform(this.adicionarDiasData(item.dias - 1, dataInicio),'dd/MM/yyyy'));
          this.newForm.controls['getDias'].patchValue(item.dias);
          this.newForm.controls['dias'].patchValue('');
          this.isDias = true;
        } else {
          this.newForm.controls['getDias'].patchValue('');
          if (dias) {
            this.newForm.controls['dataFim'].patchValue(this.datePipe.transform(this.adicionarDiasData(dias - 1, dataInicio),'dd/MM/yyyy'))
          } else {
            this.newForm.controls['dataFim'].patchValue('')
          }
          this.isDias = false;
        }
      }
    });
  }
  /**
   * preenche a data final quando o dia é digitado
   */
  eventDias() {
    if (!this.isDias) {
      const dataInicio = this.newForm.controls['dataInicio'].value;
      let dias = this.newForm.controls['dias'].value;
      if (dias) {
        this.isDiasObr = false;
        this.newForm.controls['dataFim'].patchValue('');
        if (dataInicio) {
          const dataFim = this.adicionarDiasData(dias - 1, dataInicio);
          this.newForm.controls['dataFim'].patchValue(this.datePipe.transform(dataFim, 'dd/MM/yyyy'));
        }
      }else{
        this.isDiasObr = true;
      }
    }
  }

}