import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { USER_INFO } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/user/user.service';
import { Observable } from 'rxjs';
import { getRequestOption } from '../../helpers/Helpers';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  baseUrl =
    environment.apiBaseUrl +
    'wp-json/api/' +
    environment.apiVersion +
    '/redirectprofile';
  userInfo: any = JSON.parse(localStorage.getItem(USER_INFO)!);

  constructor(private http: HttpClient, private userService: UserService) {}
  // getProjectList(): Observable<any> {
  //   const userInfo = this.userService.getUserInfo();
  //   return this.http.get<any>(this.baseUrl, getRequestOption());
  // }
  addNewRedirectProfile(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data, getRequestOption());
  }
}
