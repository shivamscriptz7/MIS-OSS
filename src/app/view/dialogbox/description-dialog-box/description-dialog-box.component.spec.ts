import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDialogBoxComponent } from './description-dialog-box.component';

describe('DescriptionDialogBoxComponent', () => {
  let component: DescriptionDialogBoxComponent;
  let fixture: ComponentFixture<DescriptionDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
