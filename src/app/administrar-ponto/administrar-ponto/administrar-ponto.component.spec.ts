import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarPontoComponent } from './administrar-ponto.component';

describe('AdministrarPontoComponent', () => {
  let component: AdministrarPontoComponent;
  let fixture: ComponentFixture<AdministrarPontoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrarPontoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarPontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
