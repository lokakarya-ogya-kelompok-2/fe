import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAchievementFormComponent } from './emp-achievement-form.component';

describe('EmpAchievementFormComponent', () => {
  let component: EmpAchievementFormComponent;
  let fixture: ComponentFixture<EmpAchievementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAchievementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAchievementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
