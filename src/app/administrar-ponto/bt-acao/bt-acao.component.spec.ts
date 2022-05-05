import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtAcaoComponent } from './bt-acao.component';

describe('BtAcaoComponent', () => {
  let component: BtAcaoComponent;
  let fixture: ComponentFixture<BtAcaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtAcaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtAcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
