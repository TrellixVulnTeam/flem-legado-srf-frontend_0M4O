import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from '../../service/funcionario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { FrequenciaService } from '../../service/frequencia.service';
import { DatePipe } from '@angular/common';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { UserDataService } from '../../service/user-data.service';

@Component({
  selector: 'app-lancar-ponto-atraso',
  templateUrl: './lancar-ponto-atraso.component.html',
  styleUrls: ['./lancar-ponto-atraso.component.scss']
})
export class LancarPontoAtrasoComponent implements OnInit {

  list: any[];
  newForm: FormGroup;
  funcionario = {} as any;
  matricula;
  justificativas = ["Esquecimento", "Defeito Sistema", "Colaborador Sem Internet"];
  marcacoes = [];
  pesquisaAtiva: boolean = false;
  loading = false;

  public maskTime = [/\d/, /\d/, ':', /\d/, /\d/];

  constructor(private funcionarioService: FuncionarioService, private frequenciaService: FrequenciaService, private datePipe: DatePipe,
    private emitirEventoService: EmitirEventoService, private user: UserDataService) {
    this.buildForm();
  }

  ngOnInit() {

    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj && obj.type === 'funcionario') {
        this.funcionario = obj.data;
        // console.log(obj.data);
      }
    });

  }
  // registra frequencias no servidor
  registrar() {
    if (this.marcacoes.length > 0) {
      this.loading = true;
      let array = [];
      this.verificaPreenchimentoMatricula();
      this.marcacoes.forEach(element => {
        let obj = {
          justificativa: element.justificativa,
          observacao: element.observacao,
          dataMarcacao: element.dataMarcacao
        }
        array.push(obj);
      });
      this.frequenciaService.registrarPontoEmAtraso(array, this.getMatricula()).subscribe(val => {
        HelperFrequencia.showNotification(this.getMensagemSucesso(array), AlertType.Success);
        this.limparForm();
        this.marcacoes = [];
        this.verificarPesquisaAtiva();
        this.loading = false;
      }, error => {
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
        this.loading = false;
      });
    } else {
      HelperFrequencia.showNotification("Existe um erro no registro", AlertType.Error);
    }

  }

  limparForm() {
    this.newForm.controls['justificativa'].patchValue("");
    this.newForm.controls['hora'].patchValue("");
    this.newForm.controls['observacao'].patchValue("");
  }

  buildForm() {

    this.newForm = new FormGroup({
      'justificativa': new FormControl('', Validators.required),
      'data': new FormControl('', Validators.required),
      'hora': new FormControl('', Validators.required),
      'observacao': new FormControl('')
    });
  }
  // adiciona uma marcao na grid de maecacoes
  adicionar() {
    if (this.validarAdcionar()) {
      return false;
    }
    if (this.verificarHorasAdicionadas()) {
      this.preencherObj();
      this.pesquisaAtiva = true;
      this.newForm.controls['hora'].patchValue("");
    }
  }
  // verifica se data ea hora já foi adicionada na grid
  verificarHorasAdicionadas(): boolean {
    let ret: boolean = true;
    this.marcacoes.forEach(element => {
      if (element.hora == this.newForm.value.hora && element.data == this.datePipe.transform(this.newForm.value.data, 'dd/MM/yyyy')) {
        HelperFrequencia.showNotification("Data e hora já adicionada", AlertType.Error);
        ret = false;
      }
    });
    return ret;
  }

  //  remove uma linha da grid
  remover(index): void {
    this.marcacoes.splice(index, 1)
    this.verificarPesquisaAtiva();
  }

  isFuncionarioRH(): boolean {
    return this.user.hasPermission("acessoRH");
  }
  //  metodo que preenche objeto para adicionar na lista da grid
  preencherObj(): void {
    const obj = {
      justificativa: this.newForm.value.justificativa,
      observacao: this.newForm.value.observacao,
      dataMarcacao: this.datePipe.transform(this.newForm.value.data, 'dd/MM/yyyy') + " " + this.newForm.value.hora,
      data: this.datePipe.transform(this.newForm.value.data, 'dd/MM/yyyy'),
      hora: this.newForm.value.hora
    }
    this.marcacoes.push(obj);
  }
  //  valida registro antes de adicionar na grid
  validarAdcionar(): boolean {

    if (!this.newForm.value.data) {
      HelperFrequencia.showNotification("Seleciona uma data", AlertType.Error);
      return true;
    }
    if (!this.newForm.value.hora) {
      HelperFrequencia.showNotification("Digite um horario", AlertType.Error);
      return true;
    }
    if (!this.newForm.value.justificativa) {
      HelperFrequencia.showNotification("Seleciona uma justificativa", AlertType.Error);
      return true;
    }
  }
  // verifica se funcionario é do rh e se for preenche matricula
  verificaPreenchimentoMatricula() {
    if (!this.funcionario.codigoDominio && !this.isFuncionarioRH()) {
      HelperFrequencia.showNotification("Por favor informe a matricula!", AlertType.Error);
      return false;
    }
  }
  // verifica se matricula esta na sessao
  getMatricula(): number {
    let matricula: number;
    if ( this.funcionario.codigoDominio ) {
      matricula = this.funcionario.codigoDominio;
    } else {
      matricula = this.user.matricula();
    }
    return matricula;
  }
  // retorna mensagem de acordo com quantidade de registro
  getMensagemSucesso(array): string {
    if (array.length > 0) {
      return "Frequências salvas com sucesso!";
    } else {
      return "Frequência salva com sucesso!";
    }
  }
  // verica a lista para habilitar ou desabilitar a grid após resgistrar ou remover
  verificarPesquisaAtiva() {
    if (this.marcacoes.length == 0) {
      this.pesquisaAtiva = false;
    }
  }

}
