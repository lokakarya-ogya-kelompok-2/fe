import { User, UserReq } from '../../features/users/models/user';

export const userToReq = (userData: User): UserReq => {
  const userReq = {} as UserReq;
  userReq.id = userData.id ?? null;
  userReq.full_name = userData.full_name ?? '';
  userReq.username = userData.username ?? '';
  userReq.email = userData.email_address ?? '';
  userReq.employee_status = userData.employee_status ?? 0;
  userReq.division_id = userData.division?.id ?? '';
  userReq.enabled = userData.enabled ?? true;
  userReq.join_date = userData.join_date ?? '';
  userReq.position = userData.position ?? '';
  userReq.roles = userData.roles?.map((role) => role.id) ?? [];
  return userReq;
};
