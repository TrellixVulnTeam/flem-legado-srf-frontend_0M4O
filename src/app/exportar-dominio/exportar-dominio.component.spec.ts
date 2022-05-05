import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarDominioComponent } from './exportar-dominio.component';

describe('ExportarDominioComponent', () => {
  let component: ExportarDominioComponent;
  let fixture: ComponentFixture<ExportarDominioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportarDominioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarDominioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
