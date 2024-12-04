import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Menu } from '../../features/menus/models/menu';
import { MenuService } from '../../features/menus/services/menu.service';
import { TokenService } from '../services/token.service';

export const roleMenuGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const jwtPayload = tokenService.decodeToken(tokenService.getToken()!);
  const userId = jwtPayload.sub!;
  const menuService = inject(MenuService);
  const data = await firstValueFrom(menuService.getMenuByUserId(userId));
  let menus: Menu[] = [];
  try {
    menus = data.content;
  } catch (e) {
    router.navigate(['/not-found']);
    return false;
  }
  const requiredPermission = route.data['permission'];
  const hasAccess = menus.some((menu) => menu.menu_name === requiredPermission);
  if (!hasAccess) {
    router.navigate(['/not-found']);
  }
  return hasAccess;
};
