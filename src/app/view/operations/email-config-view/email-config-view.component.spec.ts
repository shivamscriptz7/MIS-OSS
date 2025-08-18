import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigViewComponent } from './email-config-view.component';

describe('EmailConfigViewComponent', () => {
  let component: EmailConfigViewComponent;
  let fixture: ComponentFixture<EmailConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailConfigViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
