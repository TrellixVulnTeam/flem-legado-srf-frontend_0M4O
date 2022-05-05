import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { DialogAprovarAbonoComponent } from 'app/dialog/dialog-aprovar-abono/dialog-aprovar-abono.component';
import { DialogReabrirAbonoComponent } from 'app/dialog/dialog-reabrir-abono/dialog-reabrir-abono.component';
import { DialogReprovarAbonoComponent } from 'app/dialog/dialog-reprovar-abono/dialog-reprovar-abono.component';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { AbonoService } from 'app/service/abono.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { ExcelService } from 'app/service/excel.service';
import { FileService } from 'app/service/file.service';
import { FrequenciaService } from 'app/service/frequencia.service';
import { UserDataService } from 'app/service/user-data.service';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { DialogEnviarArquivoAbonoComponent } from 'app/dialog/dialog-enviar-arquivo-abono/dialog-enviar-arquivo-abono.component';
import { DialogHistoricoAbonoComponent } from 'app/dialog/dialog-historico-abono/dialog-historico-abono.component';
import { take } from 'rxjs/operators';
import { DashboardService } from 'app/service/dashboard.service';
import { DialogReprovarAbonoLoteComponent } from 'app/dialog/dialog-reprovar-abono-lote/dialog-reprovar-abono-lote.component';



@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.scss']
})
export class AbonosComponent implements OnInit {
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public newForm: FormGroup;

  public checkedAbonoList = [];
  public abonos = [];
  public loading = false;
  public mostrarPesquisa = false;

  public demandantes: any[];
  public municipios = [];
  public hideCombos = true;
  public myControlDemandante = new FormControl();
  public myControlMunicipio = new FormControl();
  public myControlProjetos = new FormControl();
  public idMunicipio: any;
  public idDemandante: any;
  public ngDemandante: any;
  public ngMunicipio: any;
  public filteredDemandantes: Observable<string[]>;
  public filteredMunicipios: Observable<string[]>;
  public filteredProjects: Observable<string[]>;
  public projetos: any[];
  public projetoSelecionado: any;

  public situacoes = [
    { id: 'Lançado', value: 'Lançado' },
    { id: 'Aprovado', value: 'Aprovado' },
    { id: 'Reaberta', value: 'Reaberta' },
    { id: null, value: 'Todas' }
  ]

  public tipos = [
    { id: 'Falta Médica', value: 'Falta Médica' },
    { id: 'Falta Legal', value: 'Falta Legal' },
    { id: 'Outras faltas', value: 'Outras faltas' },
    { id: "Todas", value: 'Todas' }
  ]

  constructor(private _abonosService: AbonoService,
    private _emitirEventoService: EmitirEventoService,
    private _excelService: ExcelService,
    private _frequeciaService: FrequenciaService,
    private _fileService: FileService,
    private _user: UserDataService,
    private _dialog: MatDialog,
    private _dashboardService: DashboardService) { }

  ngOnInit() {
    this._buildForm();
    this.getEmiter();
    this.comboMunicipio();
    this.getEmiter();
    this._addReprovado();
    this.getProjetos();

  }

  getProjetos() {
    this._dashboardService.projetos().subscribe(projetos => {
      this.projetos = projetos;
      this.filteredProjects = this.myControlProjetos.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterProjetos(value))
        );
    });
  }

  private _addReprovado() {
    if (this.hasPermission('viewAbonoRemovidoSrf')) {
      this.situacoes[3] = { id: 'Reprovado', value: 'Reprovado' };
      this.situacoes.push({ id: null, value: 'Todas' });
    }
  }


  _buildForm() {
    this.newForm = new FormGroup({
      'matricula': new FormControl(''),
      'status': new FormControl(''),
      'tipo': new FormControl('', Validators.required),
      'competencia': new FormControl('', Validators.required)
    });
  }


  getEmiter(): void {
    this._emitirEventoService.mensagem.subscribe(obj => {
      // console.log(obj.type)
      if (obj.type == 'abono') {
        this.pesquisar();
      }
    });
  }

  obj() {
    return {
      matricula: this.getValueOrNull(this.newForm.controls['matricula'].value),
      competencia: this.getValueOrNull(this.newForm.controls['competencia'].value),
      projeto: this.projetoSelecionado,
      municipio: this.idMunicipio,
      demandante: this.idDemandante,
      status: this.getValueOrNull(this.newForm.controls['status'].value),
      tipo: this.getValueOrNull(this.newForm.controls['tipo'].value)
    }
  }


  getValueOrNull(valor) {
    if (!valor) {
      return null;
    } else {
      return valor;
    }
  }

  getValueArrayOrNull(valor) {
    if (valor.length == 0) {
      return null;
    } else {
      return valor;
    }
  }


  pesquisar() {
    let obj = this.obj();

    if (!obj.matricula) {
      if (!obj.competencia) {
        HelperFrequencia.showNotification("Por favor digite o Mês Ano!", AlertType.Error);
        return false;
      }

      if (!obj.projeto) {
        HelperFrequencia.showNotification("Selecione um Projeto!", AlertType.Error);
        return false;
      }
      if (obj.projeto && obj.projeto == 1000) {
        if (!obj.municipio || !obj.demandante) {
          HelperFrequencia.showNotification("Por favor selecione o Municipio e Demandante!", AlertType.Error);
          return false;
        }
      }

      if (!obj.tipo) {
        HelperFrequencia.showNotification("Por favor digite um Tipo de Justificativas Ausênci!", AlertType.Error);
        return false;
      } else if (obj.tipo == 'Todas') {
        obj.tipo = null;
      }

    }

    this.loading = true;
    this._abonosService.pesquisarAbonos(this.obj()).subscribe(item => {
      // console.log(item);
      this.abonos = item;
      this.loading = false;
    }, erro => {
      // console.log(erro)
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      this.loading = false;
      this.abonos = [];
    });
  }


  showDemandanteMunicipio(option) {
    this.idMunicipio = option;
    this.comboDemandante(option);
  }

  onSelectionChangedDemandante(option) {
    this.idDemandante = option;
  }

  onSelectionChangedMunicipio(option) {
    this.projetoSelecionado = option;
    if (this.projetoSelecionado == 1000) {
      this.hideCombos = false;
    } else {
      this.hideCombos = true;
    }

  }

  comboMunicipio() {
    this._frequeciaService.obterMuniciopio().subscribe(item => {
      this.municipios = item;
      this.filteredMunicipios = this.myControlMunicipio.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filtered(value, this.municipios))
        );
    }, erro => {
      HelperFrequencia.showNotification("Erro ao carregar Municipio", AlertType.Error);
    });
  }

  comboDemandante(id) {
    this._frequeciaService.obterDemandante(id).subscribe(item => {
      this.demandantes = item;
      this.filteredDemandantes = this.myControlDemandante.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filtered(value, this.demandantes))
        );
    }, erro => {
      HelperFrequencia.showNotification("Erro ao carregar Demandante", AlertType.Error);
    });
  }

  private _filtered(value: string, lista): string[] {
    const filterValue = value.toLowerCase();
    return lista.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  limpar() {
    this._emitirEventoService.emitir("limpar", "");
    this.newForm.controls['matricula'].patchValue('');
    this.newForm.controls['competencia'].patchValue('');
    this.newForm.controls['status'].patchValue('');
    this.newForm.controls['tipo'].patchValue('');
  }

  download(id) {
    console.log(id);
    this._fileService.downloadFileAtestado(id).pipe(first()).subscribe(response => {

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


  openDialogAprovar(item) {
    // console.log(item);
    this._dialog.open(DialogAprovarAbonoComponent, {
      width: '800px',
      data: {
        obj: item,
        rh: this.isSRFRh()
      }
    });
  }

  openDialogReprovar(item) {
    // console.log(item);
    this._dialog.open(DialogReprovarAbonoComponent, {
      width: '800px',
      data: {
        obj: item,
      }
    });
  }

  openDialogReabrir(item) {
    // console.log(item);
    this._dialog.open(DialogReabrirAbonoComponent, {
      width: '800px',
      data: {
        obj: item,
      }
    });
  }

  openDialogEnviarArquivo(id) {
    // console.log(id);
    this._dialog.open(DialogEnviarArquivoAbonoComponent, {
      width: '600px',
      data: {
        id: id,
      }
    });
  }

  openDialogHistorico(id) {
    // console.log(id);
    this._dialog.open(DialogHistoricoAbonoComponent, {
      width: '600px',
      data: {
        history: this._abonosService.getHistoryAbono(id),
      }
    });
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  isSRFRh(): boolean {
    return this.hasPermission('srf_userAdm');
  }


  onCheckboxChange(option, event) {
    // console.log(this.checkedAbonoList);
    if (event.checked) {
      this.checkedAbonoList.push(option);
    } else {
      for (var i = 0; i < this.checkedAbonoList.length; i++) {
        if (this.checkedAbonoList[i] == option) {
          this.checkedAbonoList.splice(i, 1);
        }
      }
    }
  }

  reabrirDias() {
    let abonos = [];
    this.checkedAbonoList.forEach(element => {
      element.value.forEach(ele => {
        abonos.push(ele.id);
      });
    });
    // console.log(abonos)
    if (abonos.length > 0) {
      this._abonosService.reabrirEmLote(abonos).pipe(take(1)).subscribe(val => {
        this.pesquisar();
        HelperFrequencia.showNotification('Horas abonadas reabertas com sucesso', AlertType.Success);
        this.checkedAbonoList = [];
      }, error => {
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    } else {
      HelperFrequencia.showNotification('Por favor selecione os dias a ser reabertos!', AlertType.Error);
    }
  }

  private _filterProjetos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projetos.filter(option => option.nome.toLowerCase().includes(filterValue));

  }

  aprovarEmLote() {
    let abonos = [];
    // let abonos = this.validarAbonosEmLote();
    // if(!abonos){
    //   return;
    // }
    this.checkedAbonoList.forEach(element => {
      element.value.forEach(ele => {
        abonos.push(ele.id);
      });
    });
    this._abonosService.aprovarEmLote(abonos).pipe(take(1)).subscribe(val => {
      this.pesquisar();
      HelperFrequencia.showNotification('Horas abonadas aprovados com sucesso', AlertType.Success);
      this.checkedAbonoList = [];
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });

  }

  validarAbonosEmLote() {
    let abonos = [];
    let diaInvalido: boolean = false;
    let diaValidado: boolean = false;
    let diasInvalidos = [];
    this.checkedAbonoList.forEach(element => {
      // console.log(element)
      element.value.forEach(ele => {
        // console.log(ele);
        abonos.push(ele.id);
        if (this.hasPermission('atestadoSRF') && ele.tipo != 'Falta Médica') {
          diaInvalido = true;
        }
        if ((this.hasPermission('validarRegFreq')
          || this.hasPermission('outrasfaltasSRF')) && ele.tipo == 'Falta Médica') {
          diaInvalido = true;
        }
        if (ele.status == 'Aprovado') {
          diaValidado = true;
        }
      });

      if (diaInvalido) {
        diasInvalidos.push({ dia: element.key, invalido: true });
      }
      if (diaValidado) {
        diasInvalidos.push({ dia: element.key, validado: true });
      }
    });

    if (abonos.length == 0) {
      HelperFrequencia.showNotification('Por favor selecione os dias a serem validados!', AlertType.Error);
      return false;
    }

    if (diaInvalido) {
      let array = [];
      diasInvalidos.forEach(ele => {
        if (ele.invalido) {
          array.push(ele.dia);
        }
      })
      HelperFrequencia.showNotification("Você não tem permissão para validar estes dias " + array, AlertType.Error);
      return false;
    }
    if (diaValidado) {
      let array = [];
      diasInvalidos.forEach(ele => {
        if (ele.validado) {
          array.push(ele.dia);
        }
      })
      HelperFrequencia.showNotification("Estes dias já foram  validados: " + array, AlertType.Error);
      return false;
    }

    return abonos;
  }

  openDialogReprovarEmLote() {
    let abonos = [];
    // let abonos = this.validarReprovarAbonosEmLote();
    // if (!abonos) {
    //   return;
    // }

    this.checkedAbonoList.forEach(element => {
      element.value.forEach(ele => {
        abonos.push({ id: ele.id, tipo: ele.tipo });
      });
    });
    this._dialog.open(DialogReprovarAbonoLoteComponent, {
      width: '600px',
      data: {
        array: abonos,
      }
    });
  }


  validarReprovarAbonosEmLote() {
    let abonos = [];
    let diaInvalido: boolean = false;
    let diaValidado: boolean = false;
    let diasInvalidos = [];
    this.checkedAbonoList.forEach(element => {
      // console.log(element)
      element.value.forEach(ele => {
        // console.log(ele);
        abonos.push({ id: ele.id, tipo: ele.tipo });
        if (this.hasPermission('atestadoSRF') && ele.tipo != 'Falta Médica') {
          diaInvalido = true;
        }
        if ((this.hasPermission('validarRegFreq')
          || this.hasPermission('outrasfaltasSRF')) && ele.tipo == 'Falta Médica') {
          diaInvalido = true;
        }
        if (ele.status == 'Aprovado') {
          diaValidado = true;
        }
      });

      if (diaInvalido) {
        diasInvalidos.push({ dia: element.key, invalido: true });
      }
      if (diaValidado) {
        diasInvalidos.push({ dia: element.key, validado: true });
      }
    });

    if (abonos.length == 0) {
      HelperFrequencia.showNotification('Por favor selecione os dias a serem reprovados!', AlertType.Error);
      return false;
    }

    if (diaInvalido) {
      let array = [];
      diasInvalidos.forEach(ele => {
        if (ele.invalido) {
          array.push(ele.dia);
        }
      })
      HelperFrequencia.showNotification("Você não tem permissão para reprovar estes dias " + array, AlertType.Error);
      return false;
    }
    if (diaValidado) {
      let array = [];
      diasInvalidos.forEach(ele => {
        if (ele.validado) {
          array.push(ele.dia);
        }
      })
      HelperFrequencia.showNotification("Estes dias já foram  validados: " + array, AlertType.Error);
      return false;
    }

    return abonos;
  }

}
