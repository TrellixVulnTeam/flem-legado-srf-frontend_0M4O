import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { EmitirEventoService } from '../../../service/emitir-evento.service';
import { DashboardService } from 'app/service/dashboard.service';


@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent implements OnInit {

  checkedList = [];
  checked: boolean = false;
  projetos: any[];
  filteredProjects: Observable<string[]>;
  myControl = new FormControl();
  selection: any;
  checkedListRetorno = [];
  hiddenTodos: boolean = false;
  @Input('todos') todos;

  constructor(private service: DashboardService, private emitirEventoService: EmitirEventoService) { }

  @Input() isChecked = false;

  ngOnInit() {
    this.carregarProjetos();
    if (this.todos == 'N') {
      this.hiddenTodos = true;
    }
    this.getEmiter();
  }

  carregarProjetos() {
    this.service.projetos().subscribe(projetos => {
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

  };

  marcarTodos() {
    this.checked = true;
    this.checkedList = [];
    for (var i = 0; i < this.projetos.length; i++) {
      this.checkedList.push(this.projetos[i]);
    }
    this.emiterProjetos(this.checkedList);
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projetos.filter(option => option.nome.toLowerCase().includes(filterValue));
  }


  onCheckboxChange(option, event) {
    // console.log(this.checkedList);
    if (event.target.checked) {
      this.checkedList.push(option);
    } else {
      for (var i = 0; i < this.projetos.length; i++) {
        if (this.checkedList[i] == option) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    this.emiterProjetos(this.checkedList);
  }

  emiterProjetos(checkedList) {
    this.emitirEventoService.emitir("projetos", checkedList);
  }

  getEmiter(): void {
    this.emitirEventoService.mensagem.subscribe(obj => {
      console.log(obj.type);
      if (obj.type == 'limpar') {
        this.limparTodos();
      }
    });
  }



}
