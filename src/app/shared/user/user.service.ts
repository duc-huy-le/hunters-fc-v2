import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import {
  IS_PROCESSING_LOGIN,
  IS_VALIDATING_ACC,
  USER_INFO,
} from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { getRequestOption } from '../../helpers/Helpers';
import { User } from '../../models/User';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl =
    environment.apiBaseUrl + 'wp-json/api/' + environment.apiVersion + '/user';
  userData!: User | null;
  private userInfoSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private userInfo: any = null;
  private currentRoute: string | null = '';

  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fetchUserInfo();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        console.log('Current route:', this.currentRoute);
      });
  }

  // private fetchUserInfo() {
  //   this.http.get<any>(this.baseUrl, getRequestOption()).subscribe((res) => {
  //     if (res && res.code === 200 && res.data) {
  //       this.userInfo = res.data;
  //       this.userInfoSubject$.next(res.data);
  //     }
  //   }, (error) => {
  //     if (error?.error?.code === 403) {
  //       localStorage.removeItem(USER_INFO);
  //       this.msg.error('Your session has expired. Please login again.');
  //       this.router.navigate(['/login']);
  //     }
  //   })
  // }
  private fetchUserInfo() {
    const isProcessingLogin = localStorage.removeItem(IS_PROCESSING_LOGIN)!;
    if (isProcessingLogin === 'true') {
      return;
    }
    this.http
      .get<any>(this.baseUrl, getRequestOption())
      .pipe(
        tap(
          (res) => {
            if (res && res.code === 200 && res.data) {
              this.userInfo = res.data;
              this.userInfoSubject$.next(res.data);
            } else if (res?.code === 500) {
              localStorage.removeItem(USER_INFO);
              if (this.currentRoute !== '/register') {
                this.msg.error(
                  'Phiên của bạn đã hết hạn. Xin vui lòng đăng nhập lại.'
                );
                this.router.navigate(['/login']);
              }
            }
          },
          (error) => {
            if (error?.error?.code === 403) {
              localStorage.removeItem(USER_INFO);
              if (this.currentRoute !== '/register') {
                this.msg.error(
                  'Phiên của bạn đã hết hạn. Xin vui lòng đăng nhập lại.'
                );
                this.router.navigate(['/login']);
              }
            }
          }
        )
      )
      .subscribe();
  }

  sendUserInfo(userInfo?: any) {
    if (userInfo) this.userInfo = userInfo;
    this.userInfoSubject$.next(userInfo ?? this.userInfo);
  }

  subscribeUserInfo() {
    return this.userInfoSubject$.asObservable();
  }

  async getUserInfo(): Promise<any> {
    if (this.userData) return this.userData;
    await this.http
      .get<any>(this.baseUrl, getRequestOption())
      .toPromise()
      .then((res) => {
        if (res && res.code === 200 && res.data) {
          this.userData = res.data;
        } else if (res.code === 403) {
          localStorage.removeItem(USER_INFO);
          this.msg.error(
            'Phiên của bạn đã hết hạn. Xin vui lòng đăng nhập lại.'
          );
          this.router.navigate(['/login']);
        }
      })
      .catch((error) => {
        if (error?.error?.code === 403) {
          localStorage.removeItem(USER_INFO);
          this.msg.error(
            'Phiên của bạn đã hết hạn. Xin vui lòng đăng nhập lại.'
          );
          this.router.navigate(['/login']);
        }
      });
    return this.userData;
  }
  // getUserInfo(): Observable<any> {
  //   if (this.userData) {
  //     return of(this.userData);
  //   }
  //   return this.http.get<any>(this.baseUrl, getRequestOption()).pipe(
  //     map((res) => {
  //       if (res && res.code === 200 && res.data) {
  //         this.userData = res.data;
  //         return this.userData;
  //       }
  //       throw new Error('Failed to fetch user data');
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching user data:', error);
  //       return of(null);
  //     })
  //   );
  // }

  getUserData(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
  getAffiliateData(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/affiliate', getRequestOption());
  }
  exchangeMoney(payload: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + '/exchange',
      payload,
      getRequestOption()
    );
  }
  setUserData(userData: User) {
    this.userData = userData;
  }
  resetUserData() {
    this.userData = null;
    this.userInfo = null;
    this.userInfoSubject$.next(this.userInfo);
  }
}
