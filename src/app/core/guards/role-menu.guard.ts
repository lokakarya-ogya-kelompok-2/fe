import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Menu } from '../../features/menus/models/menu';
import { MenuService } from '../../features/menus/services/menu.service';
import { TokenService } from '../services/token.service';

export const roleMenuGuard: CanActivateFn = async (route, state) => {
  const tokenService = inject(TokenService);
  const jwtPayload = tokenService.decodeToken(tokenService.getToken()!);
  const userId = jwtPayload.sub!;
  const menuService = inject(MenuService);
  const data = await firstValueFrom(menuService.getMenuByUserId(userId));
  let menus: Menu[] = [];
  try {
    menus = data.content;
  } catch (e) {
    console.error(e);
    return false;
  }
  const requiredPermission = route.data['permission'];
  return menus.some((menu) => menu.menu_name === requiredPermission);
};
