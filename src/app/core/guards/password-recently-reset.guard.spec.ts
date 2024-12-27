import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { passwordRecentlyResetGuard } from './password-recently-reset.guard';

describe('passwordRecentlyResetGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => passwordRecentlyResetGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
