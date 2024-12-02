import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleMenuGuard } from './role-menu.guard';

describe('roleMenuGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleMenuGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
