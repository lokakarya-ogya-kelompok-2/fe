import { TestBed } from '@angular/core/testing';

import { EmpAchievementService } from './emp-achievement.service';

describe('EmpAchievementService', () => {
  let service: EmpAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
