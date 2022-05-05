import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmFrequenciaDisponibilizadaComponent } from './dialog-confirm-frequencia-disponibilizada.component';

describe('DialogConfirmFrequenciaDisponibilizadaComponent', () => {
  let component: DialogConfirmFrequenciaDisponibilizadaComponent;
  let fixture: ComponentFixture<DialogConfirmFrequenciaDisponibilizadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmFrequenciaDisponibilizadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmFrequenciaDisponibilizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
