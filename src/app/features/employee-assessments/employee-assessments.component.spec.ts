import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAssessmentsComponent } from './employee-assessments.component';

describe('EmployeeAssessmentsComponent', () => {
  let component: EmployeeAssessmentsComponent;
  let fixture: ComponentFixture<EmployeeAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAssessmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
