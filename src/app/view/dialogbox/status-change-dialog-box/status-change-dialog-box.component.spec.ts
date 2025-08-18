import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusChangeDialogBoxComponent } from './status-change-dialog-box.component';

describe('StatusChangeDialogBoxComponent', () => {
  let component: StatusChangeDialogBoxComponent;
  let fixture: ComponentFixture<StatusChangeDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusChangeDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusChangeDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
