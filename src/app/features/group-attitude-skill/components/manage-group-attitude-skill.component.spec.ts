import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupAttitudeSkillComponent } from './manage-group-attitude-skill.component';

describe('ManageGroupAttitudeSkillComponent', () => {
  let component: ManageGroupAttitudeSkillComponent;
  let fixture: ComponentFixture<ManageGroupAttitudeSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGroupAttitudeSkillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGroupAttitudeSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
