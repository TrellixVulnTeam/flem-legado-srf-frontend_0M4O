import { Component, OnInit } from '@angular/core';
import { ConfirmEmailService } from '../service/confirm-email.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  msgReturn;
  isErro = true;
  constructor(private confirmService: ConfirmEmailService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.params.subscribe(params => {
      const token = params.id;
      this.confirmarEmail(token);
    });
  }

  ngOnInit() {
    
  }

  confirmarEmail(token){
    
    this.confirmService.confirmarEmail(token).subscribe(map=>{
      this.msgReturn = "Confirmado com sucesso";
      this.isErro = false;
    }, erro =>{
      this.isErro = true;
      this.msgReturn = "Erro ao confirmar e-mail";
    });
  }

}
