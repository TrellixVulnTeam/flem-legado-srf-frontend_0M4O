import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { ExcelService } from '../../service/excel.service';
import { FrequenciaService } from '../../service/frequencia.service';
import { RelatorioService } from '../../service/relatorio.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit, OnDestroy {

  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  loading = false;
  combTipoDeRelatorios = new Map();
  tipoDeRelatorios = new Map();
  checkedList = [];
  form: FormGroup;
  isDataFim: boolean;
  isJustificativa: boolean = true;
  jusSelected:boolean = false;



  constructor(private frequenciaService: FrequenciaService,
    private relatorioService: RelatorioService,
    private excelService: ExcelService,
    private emitirEventoService: EmitirEventoService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.buildForm();
    this.carrgarTipoRelatorio();
    this.obterProjetosSelecionados();
    this.comboTipoJustificativas();
  }

  ngOnDestroy() {
    this.emiterProjetosTodos(false);
  }

  carrgarTipoRelatorio() {
    this.relatorioService.tipoDeRelatorio().subscribe(item => {
      this.tipoDeRelatorios = item;
    });
  }

  comboTipoJustificativas() {
    this.relatorioService.tiposDeJustificativas().subscribe(item => {
      this.combTipoDeRelatorios = item;
    });
  }

  buildForm(): void {
    this.form = new FormGroup({
      'mesAnoInicio': new FormControl(''),
      'mesAnoFim': new FormControl(''),
      'relatorio': new FormControl(''),
      'justificativa': new FormControl('')
    });
  }

  exportAsXLSX() {
    let tipo = this.form.controls['relatorio'].value;
    let listaProjeto = this.checkedList.map(item => item.codigoDominio);
    let mesAnoInicio = this.form.controls['mesAnoInicio'].value;
    let mesAnoFim = this.form.controls['mesAnoFim'].value;
    let tipoJustificativa = this.form.controls['justificativa'].value;
    let mensagem = this.validarCampos(mesAnoInicio, mesAnoFim);
    if (mensagem.length > 0) {
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    } else {
      this.imprimirTiposRelatorios(tipo, listaProjeto, mesAnoInicio, mesAnoFim,tipoJustificativa);
    }

  }

  imprimirTiposRelatorios(tipo, listaProjeto, mesAnoInicio, mesAnoFim,tipoJustificativa): void {
    this.loading = true;
    switch (Number(tipo)) {
      case 1:
        this.exportXLSXObterListaSituacaoEnvioFrequencia(listaProjeto, mesAnoInicio, mesAnoFim);
        break;
      case 2: {
        this.exportXLSXObterPendenciasRegistroFrequencia(listaProjeto, mesAnoInicio, mesAnoFim);
        break;
      }
      case 3: {
        this.exportXLSXFObterDiasDeFaltas(listaProjeto, mesAnoInicio, mesAnoFim);
        break;
      }
      case 4: {
        this.exportXLSXPrestacaoDeContas(listaProjeto, mesAnoInicio, mesAnoFim);
        break;
      }
      case 5: {
        this.exportXLSXAniversariantes(listaProjeto, mesAnoInicio);
        break;
      }
      case 6: {
        this.exportXLSXJustificativasPendentesValidacao(listaProjeto, mesAnoInicio,tipoJustificativa);
        break;
      }
    }
  }

  validarCampos(mesAnoInicio, mesAnoFim): string {
    let mensagem = "";
    let tipo = this.form.controls['relatorio'].value;
    let arrayInicio = mesAnoInicio.split('/');
    let arrayFim = mesAnoFim.split('/');
    let listaProjeto = this.checkedList.map(item => item.codigoDominio);
    let justificativa = this.form.controls['justificativa'].value;


    if (mesAnoInicio == '') {
      return mensagem = "Por favor informe o Mês Ano Inicio";
    }

    if (Number(arrayInicio[0]) > 13) {
      return mensagem = "O Formato Mês Ano Inicio é Inválido";
    }

    if (Number(arrayFim[0]) > 13) {
      return mensagem = "O Formato Mês Ano Fim é Inválido";
    }

    if (mesAnoFim) {

      let msg: boolean = false;

      if ((Number(arrayInicio[0]) > Number(arrayFim[0])) && (Number(arrayInicio[1]) > Number(arrayFim[1]))) {
        msg = true;
      }
      if (Number(arrayInicio[1]) > Number(arrayFim[1])) {
        msg = true;
      }
      if (msg) {
        return mensagem = "O Mês Ano Inicio não pode ser maior que Mês Ano Fim";
      }

    }
    if (!tipo) {
      mensagem = "Por favor informe Tipo de Relatório";
    }
    if (listaProjeto.length == 0) {
      return mensagem = "Por favor selecione um projeto!";
    }
    if(!this.isJustificativa && !justificativa ){
      return mensagem = "Por favor selecione um Tipo de Justificativa ";
    }
    return mensagem;
  }


  exportXLSXObterListaSituacaoEnvioFrequencia(listaProjeto, mesAnoInicio, mesAnoFim): void {
    let dados = [];
    let itens = [];

    let obj = this.preencherObj(listaProjeto, mesAnoInicio, mesAnoFim, null);

    this.relatorioService.obterFrequenciasEnviadas(obj).subscribe(item => {
      itens = item;
      itens.forEach(i => {
        dados = this.dadosSituacaofrquencia(dados, i);
      });
      this.excelService.exportAsExcelFile(dados, "situação_da_frequência");
      this.loading = false;
    }, erro => {
      console.log(erro);
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  obterProjetosSelecionados(): void {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj.type == 'projetos') {
        this.checkedList = obj.data;
      }
    });
  }

  dadosSituacaofrquencia(dados, i): any[] {
    dados.push({
      "Matricula": i.matricula,
      "Nome": i.nome,
      "Mês ano": i.mesAnoFrequencia,
      "Município de residência": i.residencia,
      "Projeto": i.departamento,
      "Email": i.email,
      "Email confirmado": i.emailConfirmado,
      "Frequência validada": i.validada,
      "Frequência enviada": i.enviada,
      "Última Atualização": i.ultimaAtualizacao,
      "Usuário Validador": i.usuarioValidador,
      "Data Validação": i.dataValidacao,
      "Observação não assinatura do responsável":i.observacaoPontoFocal,
      "Situação": i.situacao
    });
    return dados;
  }

  preencherObj(listaProjeto, mesAnoInicio, mesAnoFim, tipo) {

    if (mesAnoFim) {
      mesAnoFim = "01/" + mesAnoFim;
    } else if (!mesAnoFim) {
      mesAnoFim = "01/" + mesAnoInicio;
    }
    if (mesAnoInicio) {
      mesAnoInicio = "01/" + mesAnoInicio;
    }

    let obj = {
      mesAnoInicio: mesAnoInicio,
      mesAnoFim: mesAnoFim,
      codProjetos: listaProjeto,
      tipo: tipo
    }
    return obj;
  }

  exportXLSXObterPendenciasRegistroFrequencia(listaProjeto, mesAnoInicio, mesAnoFim): void {
    let dados = [];
    let itens = [];

    let obj = this.preencherObj(listaProjeto, mesAnoInicio, mesAnoFim, null);
    this.relatorioService.obterPendenciasRegistroFrequencia(obj).subscribe(item => {
      itens = item;
      itens.forEach(i => {
        dados = this.dadosPendencia(dados, i);
      });
      this.excelService.exportAsExcelFile(dados, "pendências_registro_frequência");
      this.loading = false;
    }, erro => {
      // console.log(erro);
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  dadosPendencia(dados, i): any[] {

    dados.push({
      "Matricula FLEM": i.matricula,
      "Nome": i.nome,
      "Projeto": i.projeto,
      "Data Admissão": i.dataAdmissao,
      "Situação": i.status,
      "Escritório Regional": i.escritorioRegional,
      "Unidade de lotação": i.uniadadeLotacao,
      "Pendências": i.pendencias,
      "Período de Afastamento": i.periodoAfastamento,
      "Motivo Afastamento": i.motivoAfastamento,
    });

    return dados;
  }

  exportXLSXFObterDiasDeFaltas(listaProjeto, mesAnoInicio, mesAnoFim) {
    let dados = [];
    let itens = [];

    let obj = this.preencherObj(listaProjeto, mesAnoInicio, mesAnoFim, null);
    this.relatorioService.obterDiasDeFaltas(obj).subscribe(item => {
      itens = item;
      itens.forEach(i => {
        if (i.dias) {
          dados = this.dadosFaltas(dados, i);
        }
      });
      this.excelService.exportAsExcelFile(dados, "dias_de_faltas_por_frequencia");
      this.loading = false;
    }, erro => {
      // console.log(erro);
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }


  dadosFaltas(dados, i): any[] {
    let array = i.dias.split(",");
    dados.push({
      "Matricula": i.matricula,
      "Nome": i.nome,
      "Projeto": i.departamento,
      "Dia": i.dias,
      "QTD dias": array.length,
      "Frequência enviada": i.frequenciaEnviada,
      "Situação": i.situacao
    });

    return dados;
  }

  tipoRelatorio(event): void {
    let id = event.value;
    if (id == '3') {
      this.form.controls['mesAnoFim'].patchValue('');
      this.isDataFim = true;
      this.emiterProjetosTodos(true);
      this.isJustificativa = true;
    } else if (id == '5') {
      this.isDataFim = true;
      this.isJustificativa = true;
    } else if (id == '6') {
      this.isDataFim = true;
      this.isJustificativa = false;
      this.jusSelected = true;
    } else if (id) {
      this.isDataFim = false;
      this.emiterProjetosTodos(false);
      this.isJustificativa = true;
    }
  }

  emiterProjetosTodos(isHabilitarTodos) {
    this.emitirEventoService.emitir("habilitar-hidden", isHabilitarTodos);
  }

  exportXLSXPrestacaoDeContas(listaProjeto, mesAnoInicio, mesAnoFim) {
    let dados = [];
    let itens = [];

    let obj = this.preencherObj(listaProjeto, mesAnoInicio, mesAnoFim, null);
    this.relatorioService.obterPrestacaoContas(obj).subscribe(item => {
      itens = item;

      itens.forEach(i => {
        dados = this.dadosPrestacaoDeContas(dados, i)
      });
      this.excelService.exportAsExcelFile(dados, "prestacao_contas_saeb");
      this.loading = false;
    }, erro => {
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  dadosPrestacaoDeContas(dados, i): any[] {

    dados.push({
      "Matricula Flem": i.matricula,
      "Nome": i.nome,
      "Projeto": i.projeto,
      "Data Admissão": i.dataAdmissao,
      "Data de inicio das Atividades": i.dataInicioAtividades,
      "Data de Rescisão": i.dataDesligamento,
      "Data Fim Contrato": i.dataFimPro,
      "Pendentes": i.pendentes,
      "Quantidade Devida": this.isNull(i.qtdEnviadas, 0) + this.isNull(i.qtdNaoEnviadas, 0),
      "Quantidade Encontrada": this.isNull(i.qtdEnviadas, 0),
      "Quantidade Pendente": this.isNull(i.qtdNaoEnviadas, 0) + this.isNull(i.qtdReprovado, 0) ,   
      "Quantidade Reprovada": this.isNull(i.qtdReprovado, 0),
      "Inicio Férias": i.inicioFerias,
      "Fim Férias": i.fimFerias,  
      "Situação da Pendência": i.situacaoPendencia   
    });

    return dados;
  }

  isNull(valor1, valor2) {
    return HelperFrequencia.isNull(valor1, valor2);
  }

  exportXLSXAniversariantes(listaProjeto, mesAnoInicio) {
    let dados = [];
    let itens = [];

    let obj = this.preencherObj(listaProjeto, mesAnoInicio, null, null);
    this.relatorioService.obterListaDeAniversariantes(obj).subscribe(item => {
      itens = item;
      itens.forEach(i => {
        dados = this.dadosAniversariantes(dados, i)
      });
      this.excelService.exportAsExcelFile(dados, "aniversariantes");
      this.loading = false;
    }, erro => {
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  dadosAniversariantes(dados, i): any[] {
    dados.push({
      "Matricula": i.matricula,
      "Nome": i.nome,
      "Data Nascimento": i.dataNascimento,
      "Projetos": i.projeto
    });
    return dados;
  }

  exportXLSXJustificativasPendentesValidacao(listaProjeto, mesAnoInicio, tipoJustificativa) {
    
    let dados = [];
    let itens = [];

    let obj = this.preencherObj(listaProjeto, mesAnoInicio, null,tipoJustificativa);
    this.relatorioService.obterJustificativasPendentesValidacao(obj).subscribe(item => {
      itens = item; 
      itens.forEach(i => {
        dados = this.dadosAbonosPendValidacao(dados, i)
      });
      this.excelService.exportAsExcelFile(dados, "abonosPendentesValidacao");
      this.loading = false;
    }, erro => {
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      } 
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    }); 
  }

  
  dadosAbonosPendValidacao(dados, i): any[] {
    dados.push({
      "Matrícula": i.matricula,
      "Nome": i.funcNome,
      "Dias": i.dias,
      "Projetos": i.projeto,
      "Tipo de Justificativa":i.tipo
    });
    return dados;
  }

  getChange(event){
    if(event.value){
      this.jusSelected = false;
    }
  }



}
