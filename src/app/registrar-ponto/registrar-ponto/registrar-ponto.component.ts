import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { FrequenciaService } from '../../service/frequencia.service';
import { Data, Router } from '@angular/router';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { DialogConfirmarEmailComponent } from 'app/dialog/dialog-confirmar-email/dialog-confirmar-email.component';
import { ComunicacaoService } from '../../service/comunicacao.service';
import { DomSanitizer } from '@angular/platform-browser';
declare const $: any;
@Component({
  selector: 'app-registrar-ponto',
  templateUrl: './registrar-ponto.component.html',
  styleUrls: ['./registrar-ponto.component.scss']
})
export class RegistrarPontoComponent implements OnInit {

  data: Date;
  newForm: FormGroup;
  loading = false;
  lat:any;
  lng:any;

  image: any | null;

  constructor(private frequenciaService: FrequenciaService, private datePipe: DatePipe, private router: Router, public dialog: MatDialog,
    private ascom: ComunicacaoService, private sanitizer: DomSanitizer) {
    this.buildForm();
  }

  ngOnInit() {
    this.frequenciaService.time().subscribe(value => {
      const year = value[0];
      const month = value[1];
      const day = value[2];
      const hour = value[3];
      const minutes = value[4];
      const seconds = value[5];
      this.data = new Date(year, month - 1, day, hour, minutes, seconds);
      this.getRelogio();
    });
    this.getImageAscom();
    this.getLocation();
  }

  getRelogio() {
    setInterval(() => {
      this.data = new Date(this.data.getTime() + 1000);
    }, 1000);
  }


  save() {
    if (this.newForm.invalid) {
      HelperFrequencia.showNotification("Os campos Usuário e Senha são obrigatórios", AlertType.Error);
    } else {
      this.loading = true;
      const dataFormatada = this.transformDate(this.data);
      this.frequenciaService.registrarPonto(this.newForm.value.nome, this.newForm.value.senha, dataFormatada,this.lat,this.lng)
        .subscribe(response => {
          HelperFrequencia.showNotification('Frequência Registrada com Sucesso', AlertType.Success);
          HelperFrequencia.showNotification(response.value, AlertType.Success);
          this.buildForm();
          this.loading = false;
        }, error => {
          this.loading = false;
          if (error.error[0] != null && error.error[0].value == "NaoValidado") {
            this.openDialogConfirmarEmail(error.error[1].value);
          } else {
            HelperFrequencia.showNotification(error.error.message, AlertType.Error);
          }
        });
    }
  }


  buildForm() {
    this.newForm = new FormGroup({
      'nome': new FormControl('', Validators.required),
      'senha': new FormControl('', Validators.required),
    });
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
  }

  openDialogConfirmarEmail(mensagem): void {
    const dialogRef = this.dialog.open(DialogConfirmarEmailComponent, {
      width: '600px',
      data: {
        mensagem: mensagem
      }
    });
  }

  getImageAscom() {
    this.ascom.image().subscribe(img => {
      this.createImageFromBlob(img);
    });
  }

  createImageFromBlob(image: Blob) {

    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(reader.result));
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return "";
    }
    return "bt-mobile";
  }

  
  getLocation() {
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lat);
        }
      },
        (error: PositionError) => console.log(error));
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

}

