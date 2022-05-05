import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObservacaoAssinaturaFrequenciaComponent } from './dialog-observacao-assinatura-frequencia.component';

describe('DialogObservacaoFrequenciaComponent', () => {
  let component: DialogObservacaoAssinaturaFrequenciaComponent;
  let fixture: ComponentFixture<DialogObservacaoAssinaturaFrequenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogObservacaoAssinaturaFrequenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogObservacaoAssinaturaFrequenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
