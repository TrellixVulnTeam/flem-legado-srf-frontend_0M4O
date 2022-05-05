import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReprovarMarcacoesComponent } from './dialog-reprovar-marcacoes.component';

describe('DialogReprovarMarcacoesComponent', () => {
  let component: DialogReprovarMarcacoesComponent;
  let fixture: ComponentFixture<DialogReprovarMarcacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogReprovarMarcacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReprovarMarcacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
