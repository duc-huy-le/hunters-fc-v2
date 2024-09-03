import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getRequestOption } from '../../helpers/Helpers';

@Injectable({
  providedIn: 'root'
})
export class AffiliateProgramService {
  baseUrl = environment.apiBaseUrl + 'wp-json/api/' + environment.apiVersion + '/affiliate';

  constructor(private http: HttpClient) { }
  getAffiliateProgramInfo(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
}
