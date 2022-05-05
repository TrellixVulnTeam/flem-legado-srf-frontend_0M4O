import { Component, OnInit, ViewChild, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { FrequenciaService } from '../../service/frequencia.service';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { take } from 'rxjs/operators';
import { FileService } from 'app/service/file.service';
import { DialogConfirmFrequenciasComponent } from 'app/dialog/dialog-confirm-frequencias/dialog-confirm-frequencias.component';
import { DialogHistoricoFrequenciaComponent } from 'app/dialog/dialog-historico-frequencia/dialog-historico-frequencia.component';
import { UserDataService } from 'app/service/user-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BancoDeHorasService } from 'app/service/banco-de-horas.service';
import { map, startWith } from 'rxjs/operators';
import { ExcelService } from 'app/service/excel.service';
import { FuncionariolocalService } from 'app/service/funcionariolocal.service';
import { DashboardService } from 'app/service/dashboard.service';

@Component({
  selector: 'app-frequencia',
  templateUrl: './frequencia.component.html',
  styleUrls: ['./frequencia.component.scss']
})
export class FrequenciaComponent implements OnInit {

  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  form: FormGroup;
  situacoes = [];
  loading: boolean = false;
  loadingZip: boolean = false;
  mostrarPesquisa: boolean = false;
  dados = new MatTableDataSource();
  checkedList = [];
  frequencias = [];
  displayedColumns: string[] = [];
  columnNames;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  codProjeto = null;
  codProjetoRetorno: any;

  checked: boolean = false;
  filteredProjects: Observable<string[]>;
  filteredDemandantes: Observable<string[]>;
  filteredMunicipios: Observable<string[]>;
  myControl = new FormControl();
  selection: any;
  checkedListRetorno = [];
  projetos: any[];
  isReprovar: boolean = false;
  isReabrir: boolean = false;
  isRadioValueInicial: string = '3';
  pageIndex: number = 0;
  situacaoFuncionario = [];
  demandantes: any[]=[];
  municipios: any[]=[];
  paths = [];
  hideCombos = true;
  myControlDemandante = new FormControl();
  myControlMunicipio = new FormControl();
  idMunicipio: any;
  idDemandante: any;
  ngDemandante: any;
  ngMunicipio: any;
  isBuscarNovamente: any = true;
  isMatricula: boolean = true;




  constructor(private _frequeciaService: FrequenciaService,
    private _emitirEventoService: EmitirEventoService,
    private _fileService: FileService,
    private _dialog: MatDialog,
    private _user: UserDataService,
    private _router: Router,
    private _avRoute: ActivatedRoute,
    private _service: DashboardService,
    private _excelService: ExcelService,
    private _funcionarioService: FuncionariolocalService) { }

  ngOnInit() {
    this._buildForm();
    this.getSituacaoFrequencia();
    this.columns();
    this.emiter();
    this.valueRadioInicial();
    this.parametrosDeRetorno();
    this.carregarProjetos();
    this.getSituacaoFuncionario();
    this.comboMunicipio();
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      'mesAno': new FormControl(''),
      'situacao': new FormControl(''),
      'matricula': new FormControl(''),
      'anexo': new FormControl(''),
      'situacaoFunc': new FormControl(''),
      'demandante': new FormControl(''),
      'municipio': new FormControl('')
    });

  }

  valueRadioInicial() {
    this.form.controls['anexo'].patchValue(this.isRadioValueInicial);
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

  getSituacaoFrequencia(): void {

    let array = [];
    this._frequeciaService.getSituacaoFrequencia().pipe(take(1)).subscribe(item => {
      array = item;
      for (let i = 0; i < array.length; i++) {
        this.situacoes[i] = array[i];
      }
    });
    this.situacoes[9] = 'Todas';
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  downloadPDF(item) {
    item.loading = true; 
    this._fileService.frequenciaJoinAtestadoJoinFerias(item.id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "frequencia.pdf";
      console.log(response);
      a.click();
      item.loading = false;
    }, error => {
      item.loading = false;
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }

  existeMatricula() {
    if (this.form.controls['matricula'].value) {
      this.isMatricula = false;
    } else {
      this.isMatricula = true;
    }
  }

  buscar(loading, isInicial): void {

    let mensagem = this.validarCampos();
    if (mensagem.length == 0) {
      this.loading = loading;
      let obj = this.objetoPesquisa(isInicial);
      this.isBuscarNovamente = true;
      this.existeMatricula();
      this._frequeciaService.getFrequenciasParaValidacao(obj).subscribe(item => {
        this.frequencias = item;
        this.paths = item.filePath;
        this.dados = new MatTableDataSource(item);
        this.dados.sort = this.sort;
        this.dados.paginator = this.paginator;
        this.loading = false;
        this.mostrarPesquisa = true;
        this.isReprovar = false;
        this.isReabrir = false;
      }, erro => {
        HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
        this.loading = false;
        this.mostrarPesquisa = false;
        this.isReprovar = false;
        this.isReabrir = false;
      });
    } else {
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    }
  }

  codigoProjetoSelecionado() {
    let i = 0;
    let ids = [];
    this.checkedList.forEach(item => {
      if (item) {
        if (item.codigoDominio) {
          ids[i] = item.codigoDominio;
        } else if (!item.codigoDominio) {
          ids[i] = item
        }
        i++;
      }
    });
    if (ids.length == 0) {
      ids = null;
    }
    return ids;
  }

  columns() {
    this.columnNames = [
      { id: 'matricula', value: 'Matrícula' },
      { id: 'nome', value: 'Nome' },
      { id: 'competencia', value: 'Mês Ano' },
      { id: 'projeto', value: 'Projeto' },
      { id: 'situacaoFrequenciaConcatenada', value: 'Situação' },
      { id: 'id', value: 'Ação' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }


  aprovar(item): void {
    item.loading = true;
    this.loading = false;
    this._frequeciaService.validarFrequencia(item.id).pipe(take(1)).subscribe(obj => {
      item.loading = false;
      HelperFrequencia.showNotification("Frequência aprovada com sucesso.", AlertType.Success);
      this.buscar(false, false);
    }, erro => {
      let mensagem = erro.error.message;
      item.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  disponibilizarFolha(item): void {
    item.loading = true;
    this.loading = false;
    this._frequeciaService.disponiblizarFolha(item.id).pipe(take(1)).subscribe(response => {
      item.loading = true;
      HelperFrequencia.showNotification("Frequência disponibilizada com sucesso!", AlertType.Success);
      this.buscar(false, false);
    }, error => {
      item.loading = false;
      let mensagem = error.error.message;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }

  validarCampos(): string {
    let isValid = this.isReabrir || this.isReabrir;

    if (!this.form.controls['matricula'].value
      && !this.form.controls['situacao'].value
      && !this.form.controls['mesAno'].value
      && (this.checkedList != null && this.checkedList.length == 0)
      && !isValid) {
      return "Selecione pelo menos um desses filtros: Matrícula, Mês Ano, Situação ou Projetos"
    }
    return "";
  }

  getSituacaoSelecionada(): string {
    let situacao = this.form.controls['situacao'].value;
    if (situacao && situacao != 'Todas') {
      return situacao;
    } else {
      return null;
    }
  }

  getSituacaoFuncionarioSelecionada(): string {
    let situacao = this.form.controls['situacaoFunc'].value;
    if (situacao && situacao != 'Todas') {
      return situacao;
    } else {
      return null;
    }
  }

  openDialogReprovar(item) {
    this.openDialog(item, true);
  }

  openDialogReabrir(item) {
    this.openDialog(item, false);
  }

  openDialog(item, reprovar) {
    item.observacao = null;
    const dialogRef = this._dialog.open(DialogConfirmFrequenciasComponent, {
      width: '800px',
      data: {
        obj: item,
        reprovar: reprovar
      }
    });
  }

  openDialogHistorico(item) {
    const dialogRef = this._dialog.open(DialogHistoricoFrequenciaComponent, {
      width: '800px',
      data: {
        history: this._frequeciaService.getHistory(item.id),
        competencia: item.competencia
      }
    });
  }

  emiter(): void {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj.data == 'reprovar') {
        this.isReprovar = true;
      } else if (obj.data == 'reabrir') {
        this.isReabrir = true;
      }
      if (this.isReprovar || this.isReabrir) {
        this.buscar(true, false);
      }

    });
  }

  administrarPonto(item) {
    let codProjeto = null;
    let codProjetoStr = this.codProjetoStr();
    if (!this.codProjetoRetorno && this.codProjetoRetorno == codProjetoStr) {
      codProjeto = this.codProjetoRetorno;
    } else {
      codProjeto = codProjetoStr;
    }


    this._router.navigate(['/administrar-ponto'], {
      queryParams: {
        matriculaPesquisa: this.form.controls['matricula'].value,
        matricula: item.matricula,
        nome: item.nome,
        competencia: item.competencia,
        competenciaPesquisa: this.form.controls['mesAno'].value,
        codProjeto: item.codProjeto,
        codProjetoPesquisa: codProjeto,
        situacaoFrequencia: this.getSituacaoSelecionada(),
        anexo: this.form.controls['anexo'].value,
        voltar: true,
        pageIndex: this.pageIndex,
        returnUrl: this._router.url,
        situacaoFuncionario: this.getSituacaoFuncionarioSelecionada()
      },
      skipLocationChange: true
    });
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  objetoPesquisa(isInicial) {

    let codProjeto = this.splitCodProjeto();
    if (!codProjeto || isInicial) {
      codProjeto = this.codigoProjetoSelecionado();
    }
    let anexo = this.form.controls['anexo'].value;
    let isAnexo: boolean = false;
    let isTodas: boolean = false;

    switch (anexo) {
      case '1':
        isAnexo = true;
        break;
      case '2':
        isAnexo = false;
        break;
      default:
        isTodas = true;
    }

    let obj = {
      matricula: this.form.controls['matricula'].value,
      competencia: this.form.controls['mesAno'].value != "" ? this.form.controls['mesAno'].value : null,
      situacaoFrequenciaDescicao: this.getSituacaoSelecionada(),
      codProjetos: codProjeto,
      isAnexo: isAnexo,
      isTodasSituacoes: isTodas,
      situacaoFuncionario: this.getSituacaoFuncionarioSelecionada(),
      demandante: this.idDemandante,
      municipio: this.idMunicipio

    }
    return obj;
  }


  parametrosDeRetorno() {
    let returnADMF = this._avRoute.snapshot.queryParamMap.get("returnADMF");
    if (returnADMF) {
      let matricula = this._avRoute.snapshot.queryParamMap.get("matricula");
      let competencia = this._avRoute.snapshot.queryParamMap.get("competencia");
      let situacaoFrequencia = this._avRoute.snapshot.queryParamMap.get("situacaoFrequencia");
      let anexo = this._avRoute.snapshot.queryParamMap.get("anexo");
      let situacaoFuncionario = this._avRoute.snapshot.queryParamMap.get("situacaoFuncionario");

      this.form.controls['matricula'].patchValue(matricula);
      this.form.controls['mesAno'].patchValue(competencia);
      this.form.controls['situacao'].patchValue(situacaoFrequencia);
      this.form.controls['anexo'].patchValue(anexo);
      this.form.controls['situacaoFunc'].patchValue(situacaoFuncionario);
      this.codProjetoRetorno = this._avRoute.snapshot.queryParamMap.get("codProjeto");
      if (this.codProjetoRetorno) {
        this.checkedListRetorno = this.splitCodProjeto();
        this.checkedList = this.checkedListRetorno;
      }
      if (this._avRoute.snapshot.queryParamMap.get("pageIndex")) {
        this.pageIndex = Number(this._avRoute.snapshot.queryParamMap.get("pageIndex"));
      }

      this.buscar(true, false);
    }
  }

  splitCodProjeto() {

    let array = null;
    if (this.codProjetoRetorno) {
      array = [];
      array = this.codProjetoRetorno.split(",");
    }
    return array;
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

  carregarProjetos() {
    this._service.projetos().subscribe(projetos => {
      this.projetos = projetos;
      this.filteredProjects = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });

  }

  marcarDesmarcar() {
    if (this.checked)
      this.limparTodos();
    else
      this.marcarTodos();
  }

  limparTodos() {
    this.checked = false;
    this.checkedList = [];
    this.checkedListRetorno = [];
  };

  marcarTodos() {
    this.checked = true;
    this.checkedList = [];
    for (var i = 0; i < this.projetos.length; i++) {
      this.checkedList.push(this.projetos[i]);
    }
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projetos.filter(option => option.nome.toLowerCase().includes(filterValue));
  }


  onCheckboxChange(option, event) {
    const checkedAux = this.checkedList;

    if (event.target.checked) {
      for (let i = 0; i < this.projetos.length; i++) {
        for (let j = 0; j < checkedAux.length; j++) {
          if (this.projetos[i].codigoDominio == checkedAux[j]) {
            this.checkedList.push(this.projetos[i]);
          }
        }
      }

      this.checkedList.push(option);
    } else {
      for (let i = 0; i < this.projetos.length; i++) {
        if ((this.checkedList[i] == option) || (this.checkedList[i] == option.codigoDominio)) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    this.showDemandanteMunicipio();
  }

  projetosSelecionados(obj) {
    for (let i = 0; i < this.checkedListRetorno.length; i++) {
      if (obj.codigoDominio == this.checkedListRetorno[i]) {
        return true;
      }
    }
    return false;
  }

  exportAsXLSX(isInicial) {

    let mensagem = this.validarCampos();
    if (mensagem.length == 0) {
      let dados = [];
      this.frequencias.forEach(i => {
        dados.push({
          "Matrícula": i.matricula,
          "Nome": i.nome,
          "Mês ano": i.competencia,
          "Projeto": i.projeto,
          "Situação": i.situacaoFrequenciaConcatenada
        });
        this.isReprovar = false;
        this.isReabrir = false;
      });
      this._excelService.exportAsExcelFile(dados, "Frequência");
    } else {
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    }
  }

  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }

  getSituacaoFuncionario() {
    let array = [];
    this._funcionarioService.getSituacaoFuncionario().pipe(take(1)).subscribe(item => {
      array = item;
      for (let i = 0; i < array.length; i++) {
        this.situacaoFuncionario[i] = array[i];
      }
    });
    // this.situacoes[9] = 'Todas';
  }


  onSelectionChangedDemandante($event: MatAutocompleteSelectedEvent, option) {
    this.idDemandante = option.id;
  }

  onSelectionChangedMunicipio($event: MatAutocompleteSelectedEvent, option) {
    this.idMunicipio = option.id;
    this.comboDemandante(option.id);
  }

  showDemandanteMunicipio() {
    let hide: boolean = true;
    if (this.checkedList.length == 0) {
      this.hideCombos = true;
    }
    for (let i = 0; i < this.checkedList.length; i++) {
      if (this.checkedList[i].codigoDominio == 1000) {
        hide = false;
        break;
      }
    };
    if (!hide) {
      this.hideCombos = false;
    } else {
      this.ngDemandante = '';
      this.ngMunicipio = '';
      this.hideCombos = true;
    }
  }


  private _filtered(value: string, lista): string[] {
    const filterValue = value.toLowerCase();
    return lista.filter(option => option.nome.toLowerCase().includes(filterValue));
  }


}




