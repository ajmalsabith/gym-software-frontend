import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesRemindersComponent } from './updates-reminders.component';

describe('UpdatesRemindersComponent', () => {
  let component: UpdatesRemindersComponent;
  let fixture: ComponentFixture<UpdatesRemindersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatesRemindersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatesRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
