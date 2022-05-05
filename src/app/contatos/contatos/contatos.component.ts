import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { ContatosService } from 'app/service/contatos.service';
import { UserDataService } from 'app/service/user-data.service';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.scss']
})
export class ContatosComponent implements OnInit {


  constructor(private _service: ContatosService, private _router: Router,  private _user: UserDataService) { }

  public contatos = [];
  public displayedColumns: string[] = [];
  public columnNames;
  public dados = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort

  ngOnInit() {
    this.getList();
    this.columns();
  }

  getList(){ 
    this._service.getList().subscribe(item => {
      this.dados = new MatTableDataSource(item);
      this.dados.paginator = this.paginator;
      this.dados.sort = this.sort;
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
    });
  }

  add() {
    this._router.navigate(['contatos/new'], {
      queryParams: {
        janela: 'Novo',
      },
      skipLocationChange: true
    });
  }
  edit(id) {
    this._router.navigate(['contatos/edit/' + id], {
      queryParams: {
        janela: 'Editar',
      },
      skipLocationChange: true
    });
  }

  remove(id: any) {
    if (window.confirm('Tem certeza que você quer apagar este item?')) {
      this._service.remove(id).subscribe(
        (data) => {
          this.getList();
          HelperFrequencia.showNotification("Contato Excluido com sucesso!", AlertType.Success);
        },
        error => {
          HelperFrequencia.showNotification("Erro ao excluir", AlertType.Error);
        }
      )
    }
  }

  columns() {
    this.columnNames = [
      { id: 'responsavel', value: 'Responsável' },
      { id: 'email', value: 'E-mail' },
      { id: 'id', value: 'Ação' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  
}
