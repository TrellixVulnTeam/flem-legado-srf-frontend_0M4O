import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeriadosService } from '../../service/feriados.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { DateHelper } from '../../helper/dateHelper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-feriado',
  templateUrl: './add-feriado.component.html',
  styleUrls: ['./add-feriado.component.scss']
})
export class AddFeriadoComponent implements OnInit {
  
  dt = new Date();
  id:any;
  newForm: FormGroup;
  public mask = [ /[0-3]/, /[0-9]/, '/', /[0-1]/, /[0-9]/];
  
  constructor(private _avRoute: ActivatedRoute, private router: Router, private feriadoService: FeriadosService, private datePipe: DatePipe) {}

  ngOnInit() {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.buildForm();
    if(this.id){
      this.feriadoService.get(this.id).subscribe(map=>{
        console.log(map);
        // const dataFeriado = DateHelper.getDoisDigitos(map.dia)+""+DateHelper.getDoisDigitos(map.mes);
        // this.newForm.controls['data'].patchValue(dataFeriado);
        this.newForm.controls['descricao'].patchValue(map.descricao);
      });
    }
  }

  cancelar(){
    this.router.navigate(['feriados']);
  }

  save() {
    if (!this.newForm.valid) {
      return;
    }
    const dataFeriado = this.datePipe.transform(this.newForm.value.data, "dd/MM/yyyy");

    let idVal = this.newForm.value.id;
    let obj = {id: idVal, descricao: this.newForm.value.descricao, dataFeriado: dataFeriado}
    if( idVal ){
      this.feriadoService.update(obj)
      .subscribe(() => {
        HelperFrequencia.showNotification('Atualizado com Sucesso', AlertType.Success);
      }, error=>{
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    }else{
      this.feriadoService.save(obj)
      .subscribe(() => {
        HelperFrequencia.showNotification('Salvo com Sucesso', AlertType.Success);
        this.router.navigate(['feriados'])
      }, error=>{
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    }
  }

  buildForm() {

    this.newForm = new FormGroup({
      'data': new FormControl('', Validators.required),
      'descricao': new FormControl('', Validators.required),
      'id': new FormControl(this.id)
    });
  }

}
