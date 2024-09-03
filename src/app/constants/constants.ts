import { Role } from '../shared/auth/auth.service';

export const JWT_TOKEN = 'JWT_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const USER_INFO = 'ASM_USER_INFO';
export const IS_VALIDATING_ACC = 'IS_VALIDATING_ACC';
export const TUTORIAL_PROGRESS = 'TUTORIAL_PROGRESS';
export const IS_PROCESSING_LOGIN = 'IS_PROCESSING_LOGIN';

export const RoleHomepage = {
  [Role.Admin]: 'home/dashboard',
  [Role.ProUser]: 'home/dashboard',
  [Role.UnlimitedUser]: 'home/dashboard',
  [Role.PremiumUser]: 'home/dashboard',
  [Role.TrialUser]: 'home/bootcamp-training',
  [Role.AffiliateUser]: 'home/affiliate-program',
};
