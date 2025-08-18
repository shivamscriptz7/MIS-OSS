import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPdfDownloadBoxComponent } from './custom-pdf-download-box.component';

describe('CustomPdfDownloadBoxComponent', () => {
  let component: CustomPdfDownloadBoxComponent;
  let fixture: ComponentFixture<CustomPdfDownloadBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPdfDownloadBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPdfDownloadBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
