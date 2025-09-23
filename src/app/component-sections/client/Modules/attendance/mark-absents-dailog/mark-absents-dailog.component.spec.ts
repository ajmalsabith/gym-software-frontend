import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAbsentsDailogComponent } from './mark-absents-dailog.component';

describe('MarkAbsentsDailogComponent', () => {
  let component: MarkAbsentsDailogComponent;
  let fixture: ComponentFixture<MarkAbsentsDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkAbsentsDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkAbsentsDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
