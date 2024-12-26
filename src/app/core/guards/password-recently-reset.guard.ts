import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../features/users/services/user.service';
import { TokenService } from '../services/token.service';

export const passwordRecentlyResetGuard: CanActivateFn = async (
  route,
  state
) => {
  const tokenSvc = inject(TokenService);
  const userSvc = inject(UserService);
  const router = inject(Router);
  let userId;
  try {
    const tokenPayload = tokenSvc.decodeToken(tokenSvc.getToken()!);
    userId = tokenPayload.sub!;
  } catch (e) {
    console.error('Failed to decode JWT: ', e);
    return false;
  }
  let isAllowed;

  try {
    const data = await firstValueFrom(userSvc.getById(userId));
    isAllowed = !data.content.password_recently_reset;
  } catch (e) {
    console.error('Failed to get user data: ', e);
  }

  if (!isAllowed) {
    router.navigate(['/not-found']);
    return false;
  }
  return true;
};
