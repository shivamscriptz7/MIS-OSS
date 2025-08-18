import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigMonitoringComponent } from './email-config-monitoring.component';

describe('EmailConfigMonitoringComponent', () => {
  let component: EmailConfigMonitoringComponent;
  let fixture: ComponentFixture<EmailConfigMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailConfigMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailConfigMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
