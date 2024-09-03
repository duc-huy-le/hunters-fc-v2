import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Ref } from '../../models/Ref';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { USER_INFO } from '../../constants/constants';
import { UserService } from '../../shared/user/user.service';
import { getRequestOption } from '../../helpers/Helpers';

@Injectable({
  providedIn: 'root',
})
export class RefService {
  baseUrl = environment.apiBaseUrl + 'wp-json/api/' + environment.apiVersion + '/ref';
  constructor(private http: HttpClient, private userService: UserService) {}

  getRefList(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
  addNewRef(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data, getRequestOption());
  }
}
