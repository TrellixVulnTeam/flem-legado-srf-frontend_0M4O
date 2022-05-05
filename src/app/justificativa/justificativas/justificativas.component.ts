import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { JustificativasService } from '../../service/justificativas.service';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-justificativas',
  templateUrl: './justificativas.component.html',
  styleUrls: ['./justificativas.component.scss']
})
export class JustificativasComponent implements OnInit {

  justificativas$: Observable<any[]>;
  public justificativas = [];

  constructor(private justificativaService: JustificativasService, private router: Router) { }

  ngOnInit() {
    this.getList();
  }

  // getList(){
  //   this.justificativas$ = this.justificativaService.getJustificativas();
  // }

  getList() {
    this.justificativaService.getJustificativas().subscribe(item => {
      this.justificativas = item;
    });
  }

  add() {
    this.router.navigate(['justificativa/new']);
  }

  edit(id) {
    this.router.navigate(['justificativa/edit/' + id]);
  }

  delete(id: any) {

    if (window.confirm('Tem certeza que você quer apagar este item?')) {
      this.justificativaService.delete(id).subscribe(
        (data) => {
          this.getList();
          HelperFrequencia.showNotification("Justificativa Excluida com sucesso", AlertType.Success);
        },
        error => {
          HelperFrequencia.showNotification("Erro ao excluir", AlertType.Error);
        }
      )
    }
  }

  getListaEmail(contatos): string {
    let i = 0;
    let email: string;
    contatos.forEach(item => {
      if (i > 0) {
        email += ' , ' + item.email;
      } else {
        email = item.email;
      }
      i++;
    });
    return email;
  }

}
