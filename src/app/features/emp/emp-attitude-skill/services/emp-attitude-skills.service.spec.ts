import { TestBed } from '@angular/core/testing';

import { EmpAttitudeSkillsService } from './emp-attitude-skills.service';

describe('EmpAttitudeSkillsService', () => {
  let service: EmpAttitudeSkillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpAttitudeSkillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
