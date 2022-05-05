import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator, MatTableDataSource, MatSort, MatPaginatorIntl } from '@angular/material';
import { ExcelService } from '../service/excel.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends MatPaginatorIntl implements OnInit {

  displayedColumns: string[] = [];
  columnNames = [
    { id: 'matricula', value: 'Matricula' },
    { id: 'nome', value: 'Nome' },
    { id: 'municipio', value: 'Municipio' },
    { id: 'situacao', value: 'Situação' }
  ];
  dataSourceTrabalhando = new MatTableDataSource<any[]>();
  dataSourceNaoTrabalhando = new MatTableDataSource<any[]>();
  dataSourceInativos = new MatTableDataSource<any[]>();
  dataSourceSemRegistros = new MatTableDataSource<any[]>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorNaoTrabalhando') paginatorNaoTrabalhando: MatPaginator;
  @ViewChild('paginatorInativos') paginatorInativos: MatPaginator;
  @ViewChild('paginatorSemRegistros') paginatorSemRegistros: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortNaoTrabalhando') sortNaoTrabalhando: MatSort;
  @ViewChild('sortInativos') sortInativos: MatSort;
  @ViewChild('sortSemRegistros') sortSemRegistros: MatSort;

  itemsPerPageLabel = 'Registros por Página';
  nextPageLabel = 'Próximo';
  previousPageLabel = 'Anterior';
  firstPageLabel = 'Primeira Página';
  lastPageLabel = 'Última Página';

  projetos: any[];
  myControl = new FormControl();
  filteredProjects: Observable<string[]>;

  funcionariosTrabalhando: any[] = [];
  funcionariosNaoTrabalhando: any[] = [];
  funcionariosInativos:any[]=[];
  funcionariosSemRegistros:any[]=[];
  loading = false;

  percentTrabalhando;
  percentNaoTrabalhando;
  percentInativos;
  percentSemRegistros;

  totalFuncionariosAtivos = 0;
  totalFuncionariosInativos = 0;
  totalFuncionariosTrabalhando = 0;
  totalFuncionariosNaoTrabalhando = 0;
  totalFuncionarios = 0;

  constructor(private service: DashboardService, private excelService: ExcelService) {
    super();
    this.columns();
  }

  ngOnInit() {
    this.service.projetos().subscribe(projetos => {
      this.projetos = projetos;
      this.filteredProjects = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });

  }

  exportAsXLSX(data, name): void {

    let dados = [];
    data.data.forEach(item => {
      dados.push({ Matricula: item.matricula, Nome: item.nome, Municipio: item.municipio, Situacao: item.situacao });
    });
    this.excelService.exportAsExcelFile(dados, name);

  }

  columns() {
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  getFuncionarios(event) {
    this.clearList();
    this.loading = true;
    this.obterFuncionariosTrabalhando(event);
    this.obterFuncionariosNaoTrabalhando(event);
    this.obterFuncionariosInativos(event);
  }

  obterFuncionariosTrabalhando(event){
    this.service.funcionariosPorProjetoTrabalhando(event).subscribe(items=>{
      this.funcionariosTrabalhando = items;
      this.dataSourceTrabalhando = new MatTableDataSource(this.funcionariosTrabalhando);
      this.dataSourceTrabalhando.paginator = this.paginator;
      this.dataSourceTrabalhando.sort = this.sort;
      this.closeLoading();
      this.calcularTotal();
      this.calculePercent();
      this.totalFuncionariosTrabalhando = this.funcionariosTrabalhando.length;
    }, erro => {
      this.closeLoading();
    });
  }
  obterFuncionariosNaoTrabalhando(event){
    this.service.funcionariosPorProjetoNaoTrabalhando(event).subscribe(items=>{
      this.funcionariosNaoTrabalhando = items;
      this.dataSourceNaoTrabalhando = new MatTableDataSource(this.funcionariosNaoTrabalhando);
      this.dataSourceNaoTrabalhando.paginator = this.paginatorNaoTrabalhando;
      this.dataSourceNaoTrabalhando.sort = this.sortNaoTrabalhando;
      this.closeLoading();
      this.calcularTotal();
      this.calculePercent();
      this.totalFuncionariosNaoTrabalhando = this.funcionariosNaoTrabalhando.length;
    }, erro => {
      this.closeLoading();
    });
  }

  obterFuncionariosInativos(event){
    this.service.funcionariosPorProjetoInativos(event).subscribe(items=>{
      this.funcionariosInativos = items;
      this.dataSourceInativos = new MatTableDataSource(this.funcionariosInativos);
      this.dataSourceInativos.paginator = this.paginatorInativos;
      this.dataSourceInativos.sort = this.sortInativos;
      this.closeLoading();
      this.calcularTotal();
      this.calculePercent();
      this.totalFuncionariosInativos = this.funcionariosInativos.length;
    }, erro => {
      this.closeLoading();
    });
  }
  obterFuncionariosSemRegistros(event){
    if( this.funcionariosNaoTrabalhando.length > 0 ){
      const matriculas = this.funcionariosNaoTrabalhando.map(x => x.matricula);
      this.service.funcionariosSemRegistrosPorProjeto(event, matriculas).subscribe(funcio=>{
        this.funcionariosSemRegistros = funcio;
        this.dataSourceSemRegistros = new MatTableDataSource(this.funcionariosSemRegistros);
        this.dataSourceSemRegistros.paginator = this.paginatorSemRegistros;
        this.dataSourceSemRegistros.sort = this.sortSemRegistros;
      });
    }
  }

  private closeLoading(){
    if( this.loading ){
      this.loading = false;
    }
  }

  /**
   * 
   */
  private calcularTotal(){
    this.totalFuncionariosAtivos = this.funcionariosTrabalhando.length + this.funcionariosNaoTrabalhando.length;
    this.totalFuncionarios = this.totalFuncionariosAtivos + this.funcionariosInativos.length;
  }

  calculePercent() {
    this.percentTrabalhando = ((this.funcionariosTrabalhando.length / this.totalFuncionariosAtivos) * 100).toFixed(2);
    this.percentNaoTrabalhando = ((this.funcionariosNaoTrabalhando.length / this.totalFuncionariosAtivos) * 100).toFixed(2);
    this.percentInativos = ((this.funcionariosInativos.length / this.totalFuncionarios) * 100).toFixed(2);
    this.percentSemRegistros = ((this.funcionariosSemRegistros.length / this.totalFuncionariosAtivos) * 100).toFixed(2);
  }

  clearList() {
    this.funcionariosTrabalhando = [];
    this.funcionariosNaoTrabalhando = [];
    this.funcionariosInativos = [];
    this.funcionariosSemRegistros = [];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projetos.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  applyFilterTrabalhando(value) {
    this.dataSourceTrabalhando.filter = value.trim().toLowerCase();
  }

  applyFilterNaoTrabalhando(value) {
    this.dataSourceNaoTrabalhando.filter = value.trim().toLowerCase();
  }

  applyFilterInativos(value) {
    this.dataSourceInativos.filter = value.trim().toLowerCase();
  }

}