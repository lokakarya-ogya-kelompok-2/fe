import { TestBed } from '@angular/core/testing';
import { GroupAttitudeSkillService } from './group-attitude-skill.service';

describe('ManageGroupAttitudeSkillService', () => {
  let service: GroupAttitudeSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupAttitudeSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
