import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringListingComponent } from './monitoring-listing.component';

describe('MonitoringListingComponent', () => {
  let component: MonitoringListingComponent;
  let fixture: ComponentFixture<MonitoringListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
