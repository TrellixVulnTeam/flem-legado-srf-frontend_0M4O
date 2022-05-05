import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompetenciaComponent } from './dialog-competencia.component';

describe('DialogCompetenciaComponent', () => {
  let component: DialogCompetenciaComponent;
  let fixture: ComponentFixture<DialogCompetenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCompetenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
