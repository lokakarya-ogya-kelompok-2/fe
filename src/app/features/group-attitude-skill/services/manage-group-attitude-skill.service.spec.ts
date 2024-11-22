import { TestBed } from '@angular/core/testing';
import { ManageGroupAttitudeSkillService } from './manage-group-attitude-skill.service';

describe('ManageGroupAttitudeSkillService', () => {
  let service: ManageGroupAttitudeSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageGroupAttitudeSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
