import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { EmpAttitudeSkillsComponent } from './emp-attitude-skills.component';

describe('EmpAttitudeSkillsComponent', () => {
  let component: EmpAttitudeSkillsComponent;
  let fixture: ComponentFixture<EmpAttitudeSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpAttitudeSkillsComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpAttitudeSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
