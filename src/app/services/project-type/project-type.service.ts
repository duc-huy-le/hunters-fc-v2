import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { USER_INFO } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/user/user.service';
import { Observable } from 'rxjs';
import { getRequestOption } from '../../helpers/Helpers';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {
  baseUrl =
    environment.apiBaseUrl +
    'wp-json/api/' +
    environment.apiVersion +
    '/project_type';
  userInfo: any = JSON.parse(localStorage.getItem(USER_INFO)!);
  constructor(private http: HttpClient, private userService: UserService) {}
  getProjectTypeList(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
  // getProjectById(projectId: any): Observable<any> {
  //   return this.http.get<any>(
  //     this.baseUrl + `?id=${projectId}`,
  //     getRequestOption()
  //   );
  // }
  // addNewProject(data: any): Observable<any> {
  //   return this.http.post<any>(this.baseUrl, data, getRequestOption());
  // }
  // updateProject(data: any): Observable<any> {
  //   return this.http.post<any>(this.baseUrl, data, getRequestOption());
  // }
}
