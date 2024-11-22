import { TestBed } from '@angular/core/testing';

import { ManageDivisionService } from './manage-division.service';

describe('ManageDivisionService', () => {
  let service: ManageDivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
