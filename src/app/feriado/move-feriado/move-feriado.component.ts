import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FeriadosService } from 'app/service/feriados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { DateHelper } from 'app/helper/dateHelper';

@Component({
  selector: 'app-move-feriado',
  templateUrl: './move-feriado.component.html',
  styleUrls: ['./move-feriado.component.scss']
})
export class MoveFeriadoComponent implements OnInit {

  id: any;
  newForm: FormGroup;
  movimentacoes$;

  constructor(private _avRoute: ActivatedRoute, private router: Router, private feriadoService: FeriadosService, private datePipe: DatePipe) { }

  ngOnInit() {
    
    this.id = this._avRoute.snapshot.params["id"];
    this.buildForm();

    if(this.id){
      this.feriadoService.get(this.id).subscribe(map=>{
        const dataAtual = DateHelper.getDoisDigitos(map.dia)+"/"+DateHelper.getDoisDigitos(map.mes);
        this.newForm.controls['descricao'].patchValue(map.descricao);
        this.newForm.controls['dataAtual'].patchValue(dataAtual);
      });
      this.movimentacoes$ = this.feriadoService.movimentacoes(this.id);
    }
  }

  cancelar(){
    this.router.navigate(['feriados']);
  }
  delete(seq){
    this.feriadoService.deleteMovimentacao(this.id, seq).subscribe(val=>{
      HelperFrequencia.showNotification('Excluido com sucesso', AlertType.Success);
      this.ngOnInit();
    }, error =>{
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  save() {
    if (!this.newForm.valid) {
      return;
    }
    const dataFeriado = this.datePipe.transform(this.newForm.value.data, "dd/MM/yyyy");

    let idVal = this.newForm.value.id;
    let obj = {id: idVal, dataFeriado: dataFeriado}
    if( idVal ){
      this.feriadoService.mover(obj)
      .subscribe(() => {
        HelperFrequencia.showNotification('Atualizado com Sucesso', AlertType.Success);
        this.ngOnInit();
      }, error=>{
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    }else{
      HelperFrequencia.showNotification("Erro: Feriado não encontrado", AlertType.Error);
    }
  }

  buildForm() {
    this.newForm = new FormGroup({
      'data': new FormControl('', Validators.required),
      'dataAtual': new FormControl(''),
      'descricao': new FormControl(''),
      'id': new FormControl(this.id)
    });
  }

}
