import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DashboardService } from 'app/service/dashboard.service';
import { take } from 'rxjs/operators';
import { ContatosService } from 'app/service/contatos.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-contatos',
  templateUrl: './add-contatos.component.html',
  styleUrls: ['./add-contatos.component.scss']
})
export class AddContatosComponent implements OnInit {

  public form: FormGroup;
  public email: any;
  public projeto: any;
  public codProjeto: any;
  public filteredProjects: Observable<string[]>;
  public filteredFunc: Observable<string[]>;
  public projetos: any[];
  public myControl = new FormControl();
  public janela: string;
  public id: any;
  public isChangeProjeto: boolean = false;
  public tipo: string = '1';
  public proj: boolean = false;
  public resp: boolean = false;
  public responsavel: string;
  public funcionarios = [];


  constructor(private _dashboardService: DashboardService, private _service: ContatosService, private _avRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.buildForm();
    this.janela = this._avRoute.snapshot.queryParamMap.get("janela");
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
      this.getContato(this.id);
    }
    this.event();
    this.getFuncionarios();
  }

  buildForm() {
    this._dashboardService.projetos().subscribe(projetos => {
      this.projetos = projetos;
      this.filteredProjects = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
  }

  getContato(id) {
    this._service.getContato(id).pipe(take(1)).subscribe(item => {
      this.projeto = item.nomeProjeto;
      this.email = item.email;
      this.codProjeto = item.projeto;
      this.responsavel = item.responsavel;
      if (this.responsavel) {
        this.tipo = '1'
        this.resp = true;
        this.proj = false;
      } else if (this.codProjeto) {
        this.tipo = '2'
        this.proj = true;
        this.resp = false;
      }
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    })
  }


  clear() {
    this.projeto = '';
    this.email = '';
    this.responsavel = '';
  }


  getProjeto(event) {
    this.codProjeto = event.codigoDominio;
    this.isChangeProjeto = true;
  }

  salvarContatos() {
    // if (!this.isChangeProjeto) {
    //   HelperFrequencia.showNotification('Projeto não existe!', AlertType.Error);
    //   return false;
    // }
    if (this.proj == true && !this.codProjeto) {
      HelperFrequencia.showNotification('Por favor adicione um Projeto!', AlertType.Error);
      return false;
    }

    if (this.resp == true && !this.responsavel) {
      HelperFrequencia.showNotification('Por favor adicione Responsável!', AlertType.Error);
      return false;
    }
    let obj = {} as any;
    obj.id = this.id;
    obj.email = this.email;

    if (this.responsavel) {
      obj.responsavel = this.responsavel;
      obj.projeto = null;
    } else if(this.projeto){
      obj.projeto = this.codProjeto;
      obj.responsavel = null;
    }
    if (this.id) {
      this.edit(obj);
    } else {
      this.save(obj);
    }
  }




  save(obj) {
    this._service.save(obj)
      .pipe(take(1)).subscribe(() => {
        HelperFrequencia.showNotification('Salvo com Sucesso!', AlertType.Success);
        this.clear();
        if (this.janela == 'Novo') {
          this._router.navigate(['contatos']);
        }
      }, error => {
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });

  }

  edit(obj) {
    this._service.edit(obj)
      .pipe(take(1)).subscribe(() => {
        HelperFrequencia.showNotification('Atualizado com Sucesso!', AlertType.Success);
        this.clear();
        this._router.navigate(['contatos']);
      }, error => {
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
  }

  cancelar() {
    this._router.navigate(['contatos']);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projetos.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  private _filterFuncionario(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.funcionarios.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  event() {
    if (this.tipo == '1') {
      this.resp = true;
      this.proj = false;
      this.projeto = null;
    } else if (this.tipo == '2') {
      this.proj = true;
      this.resp = false;
      this.responsavel = null;
    }
  }

  getFuncionarios(){
    this._service.getFuncionarios().subscribe(item => {
      this.funcionarios = item;
      this.filteredFunc = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterFuncionario(value))
        );
    });
  }


}
