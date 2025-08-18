import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteDialogBoxComponent } from './delete-dialog-box.component';

describe('DeleteDialogBoxComponent', () => {
  let component: DeleteDialogBoxComponent;
  let fixture: ComponentFixture<DeleteDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
