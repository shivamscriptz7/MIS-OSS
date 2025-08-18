import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionMonitoringComponent } from './permission-monitoring.component';

describe('PermissionMonitoringComponent', () => {
  let component: PermissionMonitoringComponent;
  let fixture: ComponentFixture<PermissionMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
