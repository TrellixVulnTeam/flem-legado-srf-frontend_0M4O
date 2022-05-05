import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { JustificativasService } from '../../service/justificativas.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ContatosService } from 'app/service/contatos.service';

@Component({
  selector: 'app-add-justificativa',
  templateUrl: './add-justificativa.component.html',
  styleUrls: ['./add-justificativa.component.scss']
})
export class AddJustificativaComponent implements OnInit {

  id: any;
  newForm: FormGroup;
  public isHiddenEmail = false;
  public isHiddenAbonar = false;
  public comboTiposJustificativas = [];
  public listaContatos = [];
  public listaContatosGrid = [];
  public contatos = [];
  public options = [];
  public contato: any;

  public filtered: Observable<string[]>;
  public myControl = new FormControl();
  constructor(private _avRoute: ActivatedRoute, private router: Router, private justificativaService: JustificativasService, private _contatoService: ContatosService) { }

  ngOnInit() {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.buildFormAuto();
    this.getComboTipoJustificativas();
    this.buildForm();

    if (this.id) {
      this.justificativaService.get(this.id).subscribe(map => {
        // console.log(map);
        this.newForm.controls['abono'].patchValue(map.abono);
        this.newForm.controls['descricao'].patchValue(map.descricao);
        this.newForm.controls['enviaEmail'].patchValue(map.enviaEmail);
        this.newForm.controls['prazoEmHoras'].patchValue(map.prazoEmHoras);
        this.newForm.controls['anexo'].patchValue(map.isAnexo);
        this.carregarListaEmail(map.contatos);
        this.newForm.controls['tipo'].patchValue(map.tipo);
        this.newForm.controls['dias'].patchValue(map.dias);
        this.isHiddenEmail = this.getIsEmail(map.enviaEmail);
        this.isHiddenAbonar = this.getAbono(map.abono);
      });
    } else {
      this.isHiddenAbonar = true;
      this.isHiddenEmail = true;
      this.newForm.controls['enviaEmail'].patchValue(false);
    }
  }

  carregarListaEmail(contatos) {
    this.contatos = contatos;
    this.contatos.forEach(item => {
      this.buildFormProjeto(item);
      this.listaContatos.push({ id: item.id });

    });
  }

  getDesc(projeto): string {
    let str;
    this.options.forEach(item => {
      if (projeto == item.projeto) {
        str = item.nomeProjeto;
      }
    });
    return str;
  }


  getIsEmail(isEmail) {
    if (!isEmail) {
      return true;
    } else {
      return false;
    }
  }

  getAbono(abono) {
    if (!abono) {
      return true;
    } else {
      return false;
    }
  }

  adicionar() {

    let existe = false;
    this.listaContatosGrid.forEach(item => {
      if (item.responsavel == this.contato.responsavel) {
        existe = true;
      }
    });
    if (existe) {
      HelperFrequencia.showNotification('Contato já adicionado!', AlertType.Error);
      return false;
    } else {
      this.listaContatos.push({ id: this.contato.id });
      this.listaContatosGrid.push({ id: this.contato.id, email: this.contato.email, responsavel: this.contato.responsavel });
    }

  }


  cancelar() {
    this.router.navigate(['justificativas']);
  }

  save() {
    if (!this.newForm.valid) {
      HelperFrequencia.showNotification("Por favor preencha todos os campos obrigatórios!", AlertType.Error);
      return false;
    }
    if (this.newForm.value.enviaEmail && this.listaContatos.length == 0) {
      HelperFrequencia.showNotification("Por favor adicione um contato", AlertType.Error);
      return false;
    }

    let idVal = this.newForm.value.id;
    let obj = this.preencherObj(idVal);
    if (idVal) {
      this.justificativaService.update(obj)
        .pipe(take(1)).subscribe(() => {
          HelperFrequencia.showNotification('Atualizado com Sucesso', AlertType.Success);
        }, error => {
          HelperFrequencia.showNotification(error.error.message, AlertType.Error);
        });
    } else {
      this.justificativaService.save(obj)
        .pipe(take(1)).subscribe(() => {
          HelperFrequencia.showNotification('Salvo com Sucesso', AlertType.Success);
          this.router.navigate(['justificativas'])
        }, error => {
          HelperFrequencia.showNotification(error.error.message, AlertType.Error);
        });
    }
  }

  buildForm() {

    this.newForm = new FormGroup({
      'abono': new FormControl(false, Validators.nullValidator),
      'descricao': new FormControl('', Validators.required),
      'enviaEmail': new FormControl(true, Validators.nullValidator),
      'prazoEmHoras': new FormControl(48),
      'id': new FormControl(this.id),
      'anexo': new FormControl(false, Validators.nullValidator),
      'email': new FormControl(''),
      'tipo': new FormControl('', Validators.required),
      'dias': new FormControl(''),
    });
  }

  preencherObj(idVal) {
    let obj = {
      id: idVal,
      descricao: this.newForm.value.descricao,
      abono: this.newForm.value.abono,
      enviaEmail: this.newForm.value.enviaEmail,
      prazoEmHoras: this.newForm.value.prazoEmHoras,
      isAnexo: this.newForm.value.anexo,
      contatos: this.listaContatos,
      tipo: this.newForm.value.tipo,
      dias: this.newForm.value.dias
    }
    return obj;
  }

  email(): void {
    this.isHiddenEmail = this.newForm.controls['enviaEmail'].value;
    if (!this.isHiddenEmail) {
      this.newForm.controls['email'].patchValue('');
      this.contatos = [];
      this.listaContatos = [];
      this.listaContatosGrid = [];
    }
  }

  abono(): void {
    this.isHiddenAbonar = this.newForm.controls['abono'].value;
    if (!this.isHiddenAbonar) {
      this.newForm.controls['dias'].patchValue('');
      this.listaContatos = [];
      this.listaContatosGrid = [];
    }
  }

  getComboTipoJustificativas() {
    this.justificativaService.getTiposJustificativas().subscribe(item => {
      this.comboTiposJustificativas = item;
    });
  }

  removerEmail(index) {
    this.listaContatos.splice(index, 1);
    this.listaContatosGrid.splice(index, 1);
    if (this.listaContatos.length == 0) {
      this.listaContatos = [];
      this.listaContatosGrid = [];
      this.isHiddenEmail = true;
    }
  }


  buildFormAuto() {
    this._contatoService.getList().subscribe(item => {
      this.options = item;
    });
  }
  getContato(event) {
    // console.log(event);
    this.contato = event.source.value;
  }

  buildFormProjeto(item) {
    if (item.projeto) {
      this._contatoService.getContatoProjeto(item.projeto).subscribe(i => {
        if (i.projeto == item.projeto) {
          this.listaContatosGrid.push({ id: item.id, email: item.email, responsavel: i.nomeProjeto });
        }
      });
    } else {
      this.listaContatosGrid.push({ id: item.id, email: item.email, responsavel: item.responsavel });
    }
  }
}
