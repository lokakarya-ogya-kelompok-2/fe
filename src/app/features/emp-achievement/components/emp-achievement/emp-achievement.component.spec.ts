import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAchievementComponent } from './emp-achievement.component';

describe('EmpAchievementComponent', () => {
  let component: EmpAchievementComponent;
  let fixture: ComponentFixture<EmpAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAchievementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
