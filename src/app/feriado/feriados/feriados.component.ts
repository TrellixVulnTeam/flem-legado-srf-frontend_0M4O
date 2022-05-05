import { Component, OnInit } from '@angular/core';
import { FeriadosService } from '../../service/feriados.service';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';

@Component({
  selector: 'app-feriados',
  templateUrl: './feriados.component.html',
  styleUrls: ['./feriados.component.scss']
})
export class FeriadosComponent implements OnInit {

  feriados$: Observable<any[]>;

  constructor(private feriadoService: FeriadosService, private router: Router) { }

  ngOnInit() {
    this.getList();
  }

  getList(){
    this.feriados$ = this.feriadoService.getList();
  }

  add() {
    this.router.navigate(['feriado/new']);
  }

  edit(id) {
    this.router.navigate(['feriado/edit/' + id]);
  }

  mover(id) {
    this.router.navigate(['feriado/move/' + id]);
  }

  delete(id: any) {

    if (window.confirm('Tem certeza que você quer apagar este item?')) {
      this.feriadoService.delete(id).subscribe(
        (data) =>{
          this.getList();
          HelperFrequencia.showNotification("Feriado Excluido com sucesso", AlertType.Success);
        },
        error=> {
          HelperFrequencia.showNotification("Erro ao excluir", AlertType.Error);
        }
      )
    }
  }

}
