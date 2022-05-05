import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogAprovarReprovarFeriasComponent } from './dialog-aprovar-reprovar-ferias.component';



describe('DialogAprovarReprovarFeriasComponent', () => {
  let component: DialogAprovarReprovarFeriasComponent;
  let fixture: ComponentFixture<DialogAprovarReprovarFeriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAprovarReprovarFeriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAprovarReprovarFeriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
