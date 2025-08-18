import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPermissionDialogboxComponent } from './monitoring-permission-dialogbox.component';

describe('MonitoringPermissionDialogboxComponent', () => {
  let component: MonitoringPermissionDialogboxComponent;
  let fixture: ComponentFixture<MonitoringPermissionDialogboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringPermissionDialogboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringPermissionDialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
