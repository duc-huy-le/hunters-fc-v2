import { UserService } from './../user/user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, Subject, finalize, tap } from 'rxjs';
import {
  IS_PROCESSING_LOGIN,
  IS_VALIDATING_ACC,
  JWT_TOKEN,
  REFRESH_TOKEN,
  RoleHomepage,
  TUTORIAL_PROGRESS,
  USER_INFO,
} from '../../constants/constants';
import { environment } from '../../../environments/environment';
import { getAuthRequestOption, getRequestOption, getUserHomepage } from '../../helpers/Helpers';
import { checkAuthResponseSuccess } from '../../utils/Uitls';

export enum Role {
  Admin = 1,
  UnlimitedUser = 2,
  ProUser = 6,
  PremiumUser = 23,
  AffiliateUser = 14,
  TrialUser = 5,
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.apiBaseUrl}`;
  secretKey = environment.secretKey;
  loginUrl = `${environment.apiBaseUrl}/account/login`;
  registerUrl = `${environment.apiBaseUrl}/account/register`;
  checkSessionUrl = `${environment.apiBaseUrl}/user/info`;
  loginSuccess: boolean = false;
  role?: Role;
  userInfo: any;
  private userInfoSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userInfoSubject.asObservable();
  currentBalance!: number;

  constructor(
    private router: Router,
    private http: HttpClient,
    private msg: NzMessageService,
    private userService: UserService
  ) {
    if (this.getJwtToken()) this.loginSuccess = true;
  }
  login(loginData: any): Observable<any> {
    // Lưu tạm 1 biến vào localStorage trong lúc đang đăng nhập để tránh bị lỗi user 403
    localStorage.setItem(IS_PROCESSING_LOGIN, 'true');
    const url = `${this.baseUrl}wp-json/api/${environment.apiVersion}/login`;
    return this.http.post(url, loginData, getAuthRequestOption()).pipe(
      tap((res: any) => {
        if (res?.code === 200) {
          // Store tạm thông tin này cho đến khi có api authen mới
          const userData = {
            uuid: res?.data?.uuid,
            name: res?.data?.name,
            email: res?.data?.email,
            status: res?.data?.status,
          };
          this.storeUserInfo(userData);
          this.storeTokens(res?.data?.accessToken);
          this.storeRefreshTokens(res?.data?.refreshToken);
          // Lấy thông tin user sau khi vừa đăng nhập lưu vào userService
          this.userService.sendUserInfo(res?.data);

          this.loginSuccess = true;
          this.userInfo = userData;
          const userRole = Number(res.data?.role);
          // this.userService.setUserInfo(userData);
          this.currentBalance = res?.data?.balance;
          localStorage.setItem('balanceTemp', this.currentBalance?.toString());
          const tutorialProgress = localStorage.getItem(TUTORIAL_PROGRESS);
          const isFinishTutorial = tutorialProgress
            ? JSON.parse(tutorialProgress).isFinished
            : false;
          if (isFinishTutorial) {
            this.router.navigate(['/home/dashboard']);
          } else {
            if (userRole === Role.AffiliateUser) {
              // Nếu là role affiliate thì chuyển đến trang chủ affiliate
              this.router.navigate([RoleHomepage[Role.AffiliateUser]]);
            } else {
              // Còn lại thì chuyển đến trang khóa học
            // this.router.navigate(['/home/dashboard']);
            this.router.navigate([getUserHomepage(userRole)]);
            // this.router.navigate(['/home/tutorial']);
            }
          }
        }
      }),
      finalize(() => {
        // This block of code will run regardless of whether the request succeeded or failed
        localStorage.removeItem(IS_PROCESSING_LOGIN);
        // Perform any cleanup or final actions here
      })
    );
  }

  register(registerData: any): Observable<any> {
    const url = `${this.baseUrl}wp-json/api/${environment.apiVersion}/signup`;
    return this.http.post(url, registerData, getAuthRequestOption()).pipe(
      tap((res: any) => {
        if (res?.code === 200) {
          // const userData = {
          //   uuid: res?.data?.uuid,
          //   status: res?.data?.status,
          //   name: res?.data?.name,
          //   email: res?.data?.email,
          // };
          // this.storeUserInfo(userData);
          // this.storeTokens(res?.data?.accessToken);
          // this.storeRefreshTokens(res?.data?.refreshToken);
          // this.loginSuccess = true;
          // this.userInfo = userData;
          this.router.navigate(['/register-successfully']);
          localStorage.setItem(IS_VALIDATING_ACC, 'true');
        }
      })
    );
  }

  getUserInfo(): any {
    return JSON.parse(localStorage.getItem(USER_INFO)!);
  }

  checkSession() {
    const token = this.getJwtToken();
    if (token) {
      this.getUserInfo();
    }
  }

  isAuthenticated() {
    return this.loginSuccess;
  }

  private storeTokens(token: string): void {
    localStorage.setItem(JWT_TOKEN, token);
  }
  private storeRefreshTokens(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  }
  private storeUserInfo(data: any): void {
    localStorage.setItem(USER_INFO, JSON.stringify(data));
  }
  getJwtToken(): string {
    return localStorage.getItem(JWT_TOKEN)!;
  }
  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN)!;
  }

  logout() {
    localStorage.removeItem(JWT_TOKEN);
    localStorage.removeItem(USER_INFO);
    this.loginSuccess = false;
    this.userInfo = null;
    // this.userService.setUserInfo(null);
    this.userService.resetUserData();
    this.router.navigate(['/login']);
  }

  getBalance() {
    this.currentBalance = JSON.parse(localStorage.getItem('balanceTemp')!);
    return this.currentBalance;
  }
}
