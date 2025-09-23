import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAttendanceDailogComponent } from './mark-attendance-dailog.component';

describe('MarkAttendanceDailogComponent', () => {
  let component: MarkAttendanceDailogComponent;
  let fixture: ComponentFixture<MarkAttendanceDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkAttendanceDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkAttendanceDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
