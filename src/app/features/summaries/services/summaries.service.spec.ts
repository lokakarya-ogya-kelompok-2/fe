import { TestBed } from '@angular/core/testing';

import { SummariesService } from './summaries.service';

describe('SummariesService', () => {
  let service: SummariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
