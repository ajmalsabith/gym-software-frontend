import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDialogeComponent } from './plan-dialoge.component';

describe('PlanDialogeComponent', () => {
  let component: PlanDialogeComponent;
  let fixture: ComponentFixture<PlanDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDialogeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
