import { environment } from '../../environments/environment';
import {
  JWT_TOKEN,
  REFRESH_TOKEN,
  RoleHomepage,
  USER_INFO,
} from '../constants/constants';
import { Role } from '../shared/auth/auth.service';

function getJwtToken(): string {
  return localStorage.getItem(JWT_TOKEN)!;
}

export function getRefreshToken(): string {
  return localStorage.getItem(REFRESH_TOKEN)!;
}

export function getUserInfo(): any {
  return JSON.parse(localStorage.getItem(USER_INFO)!);
}

export function getRequestOption() {
  const token = getJwtToken();
  const refreshToken = getRefreshToken();
  const uuid = getUserInfo()?.uuid;
  const headers = {
    authorization: token ?? '',
    'x-api-key': environment.xApiKey ?? '',
    'x-rfresh-token': refreshToken ?? '',
    'x-client-id': uuid ?? '',
  };
  return { headers: headers };
}

export function getAuthRequestOption() {
  const headers: any = {};
  if (environment.xApiKey) {
    headers['x-api-key'] = environment.xApiKey;
  }
  return { headers };
}

export function getUserHomepage(role: any) {
  const roleNumber = Number(role);
  if (roleNumber === Role.Admin) {
    return RoleHomepage[Role.Admin];
  } else if (roleNumber === Role.ProUser) {
    return RoleHomepage[Role.ProUser];
  } else if (roleNumber === Role.UnlimitedUser) {
    return RoleHomepage[Role.UnlimitedUser];
  } else if (roleNumber === Role.TrialUser) {
    return RoleHomepage[Role.TrialUser];
  } else if (roleNumber === Role.AffiliateUser) {
    return RoleHomepage[Role.AffiliateUser];
  } else if (roleNumber === Role.PremiumUser) {
    return RoleHomepage[Role.PremiumUser];
  } else {
    return RoleHomepage[Role.AffiliateUser];
  }
}
export function checkValidForm(formGroup: any) {
  for (const i in formGroup.controls) {
    const formControl = formGroup.controls[i] as any;
    formControl.markAsDirty();
    formControl.updateValueAndValidity();
  }
}
