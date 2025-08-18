import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringTypePermissionComponent } from './monitoring-type-permission.component';

describe('MonitoringTypePermissionComponent', () => {
  let component: MonitoringTypePermissionComponent;
  let fixture: ComponentFixture<MonitoringTypePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringTypePermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringTypePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
