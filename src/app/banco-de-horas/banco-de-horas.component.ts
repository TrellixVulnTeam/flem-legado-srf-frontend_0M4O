import { BancoDeHorasService } from '../service/banco-de-horas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EmitirEventoService } from '../service/emitir-evento.service';
import { ExcelService } from 'app/service/excel.service';

@Component({
  selector: 'app-banco-de-horas',
  templateUrl: './banco-de-horas.component.html',
  styleUrls: ['./banco-de-horas.component.scss']
})

export class BancoDeHorasComponent implements OnInit {

  // projetos: any[];
  myControl = new FormControl();
  filteredProjects: Observable<string[]>;
  funcionarios: any[] = [];
  funcionariosTrabalhando: any[] = [];
  funcionariosNaoTrabalhando: any[] = [];
  loading = false;
  mostrarPesquisa: boolean = false;
  interestFormGroup: FormGroup;
  form: FormGroup;
  orders = [];
  checkedList = [];
  // checked: boolean = false;
  displayedColumns: string[] = [];
  columnNames;
  dados = new MatTableDataSource();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  dataSource = new MatTableDataSource<any[]>();
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public individual: boolean = false;

  constructor(private service: BancoDeHorasService,
    private formBuilder: FormBuilder,
    private emitirEventoService: EmitirEventoService,
    private _excelService: ExcelService) { }

  ngOnInit() {
    const controls = this.orders.map(c => new FormControl(false));
    this.form = this.formBuilder.group({
      interestSectors: new FormArray(controls)
    });
    this.columns();
    this.obterProjetosSelecionados();
    this._buildForm();
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      'competencia': new FormControl(''),
      'matricula': new FormControl(''),
    });
  }


  pesquisar() {
    let obj = this.obj();
    if (this.checkedList && this.checkedList.length > 0 || obj.matricula) {
      this.loading = true;
      let obj = this.obj();
      if ((obj.projetoIds && obj.competencia) || (obj.matricula && obj.competencia) ) {
        this.individual = true;
      } else {
        this.individual = false;
      }
      this.service.obterBancoHoras(this.obj()).subscribe(
        items => {
          this.funcionarios = items;
          this.mostrarPesquisa = true;
          this.dados = new MatTableDataSource(this.funcionarios);
          this.dados.sort = this.sort;
          this.dados.paginator = this.paginator;
          this.loading = false;
        }, erro => {
          HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
          this.loading = false;
          this.mostrarPesquisa = false;
          this.clearList();
        }
      );
    } else {
      HelperFrequencia.showNotification("Por favor selecione pelo menos um projeto ou digite uma Matrícula", AlertType.Error);
    }
  }

  obj() {
    return {
      projetoIds: this.codigoProjetoSelecionado(),
      matricula: this.form.controls['matricula'].value,
      competencia: HelperFrequencia.isNull(this.form.controls['competencia'].value, null)
    }
  }


  clearList() {
    this.funcionarios = [];
    this.funcionariosTrabalhando = [];
    this.funcionariosNaoTrabalhando = [];
  }


  gerarRelatorioIndividual(matricula): void {
    this.loading = true;
    let obj = { matricula: matricula, competencia: HelperFrequencia.isNull(this.form.controls['competencia'].value, null) }
    this.service.downloadRelatorioBancoHorasindividual(obj).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "relatorioBancoDeHorasIndividual." + type[1];
      a.click();
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification('Não existem registro a serem impressos !', AlertType.Error);
    });
  }


  columns() {
    this.columnNames = [
      { id: 'matricula', value: 'Matricula' },
      { id: 'nome', value: 'Nome' },
      { id: 'projeto', value: 'Projeto' },
      { id: 'saldo', value: 'Banco de Horas' },
      { id: 'acao', value: 'Ação' },
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }


  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  obterProjetosSelecionados(): void {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj.type == 'projetos') {
        this.checkedList = obj.data;
      }
    });
  }

  exportAsXLSX() {
    this.loading = true;
    let dados = [];
    this.funcionarios.forEach(i => {
      dados.push({
        "Matrícula": i.matricula,
        "Nome": i.nome,
        "Projeto": i.projeto,
        "Banco de Horas": i.saldo
      });
      this.loading = false;
    });
    this._excelService.exportAsExcelFile(dados, "banco_de_horas");
  }

  codigoProjetoSelecionado() {
    let i = 0;
    let ids = [];
    this.checkedList.forEach(item => {
      if (item) {
        if (item.codigoDominio) {
          ids[i] = item.codigoDominio;
          i++;
        }
      }
    });
    if (ids.length == 0) {
      ids = null;
    }
    return ids;
  }

  gerarRelatorioIndividualMensal(matricula) {
    this.loading = true;
    let obj = { matricula: matricula, competencia: HelperFrequencia.isNull(this.form.controls['competencia'].value, null) }

    if (!obj.matricula && !obj.competencia) {
      HelperFrequencia.showNotification('Por favor digite a Matricula e Mês Ano Inicio!', AlertType.Error);
      return false;
    } else if (!obj.competencia) {
      HelperFrequencia.showNotification('Por favor digite Mês Ano Inicio!', AlertType.Error);
      return false;
    } else if (!obj.matricula) {
      HelperFrequencia.showNotification('Por favor digite a Matricula!', AlertType.Error);
      return false;
    }

    this.service.downloadRelatorioBancoHorasindividualMensal(obj).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "relatorioBancoDeHorasIndividualMensal." + type[1];
      a.click();
      this.loading = false;
    }, error => {
      this.loading = false;
      HelperFrequencia.showNotification('Não existem registro a serem impressos !', AlertType.Error);
    });
  }


}