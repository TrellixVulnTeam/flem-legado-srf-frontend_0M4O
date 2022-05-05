import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogUploadArquivoFeriasComponent } from './dialog-upload-arquivo-ferias.component';



describe('DialogUploadAvisoFeriasComponent', () => {
  let component: DialogUploadArquivoFeriasComponent;
  let fixture: ComponentFixture<DialogUploadArquivoFeriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUploadArquivoFeriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUploadArquivoFeriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  }); 
});

