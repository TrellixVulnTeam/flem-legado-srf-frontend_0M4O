import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionariolocalService } from 'app/service/funcionariolocal.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})
export class FuncionariosComponent implements OnInit {

  funcionarios$: Observable<any[]>;

  dataSource = new MatTableDataSource<any[]>();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  itemsPerPageLabel = 'Registros por Página';
  nextPageLabel = 'Próximo';
  previousPageLabel = 'Anterior';
  firstPageLabel = 'Primeira Página';
  lastPageLabel = 'Última Página';
  pageIndex: number = 0;

  displayedColumns: string[] = [];
  columnNames = [
    { id: 'nome', value: 'Nome' },
    { id: 'matricula', value: 'Matricula' },
    { id: 'cpf', value: 'CPF' },
    { id: 'projeto', value: 'Projeto' },
    { id: 'situacao', value: 'Situação' },
    { id: 'action', value: 'Ação' }
  ];
  
  constructor(private _funcionarioService: FuncionariolocalService,private _router: Router, private _avRoute: ActivatedRoute) { }

  ngOnInit() {
    this._columns();
    this._all();
    this._params();
  }

  private _params(): void {
    if (this._avRoute.snapshot.queryParamMap.get("pageIndex")) {
        this.pageIndex = Number.parseInt(this._avRoute.snapshot.queryParamMap.get("pageIndex"));
    }
  }

  enabled(item){
    const label = item.registraFrequencia ? 'Desabilitar' : 'Habilitar';
    if (window.confirm('Tem certeza que deseja '+label+' este Funcionário para Registro de Frequência pelo SRF?')) {
      this._funcionarioService.enable(item.matricula).subscribe(
        (data) =>{
          item.registraFrequencia = !item.registraFrequencia;
          HelperFrequencia.showNotification(data.value, AlertType.Success);
        },
        error=> {
          HelperFrequencia.showNotification("Erro ao atualizar Funcionário", AlertType.Error);
        }
      )
    }
    
  }

  private _all(){
    this._funcionarioService.all().subscribe(items=>{
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilterTrabalhando(value) {
    if(value.trim().toLowerCase() === 'nao' || value.trim().toLowerCase() === 'não'){
      this.dataSource.filter = 'false';
    } else {
      this.dataSource.filter = value.trim().toLowerCase();
    }
    
  }

  private _columns() {
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  configurar(matricula){
    this._router.navigate(['funcionarios/configurar-funcionario/' + matricula], {
      queryParams: {
        pageIndex: this.pageIndex,
      },
      skipLocationChange: true
    });
  }

  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }


}
