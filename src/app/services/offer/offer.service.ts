import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { getRequestOption } from '../../helpers/Helpers';
@Injectable({
  providedIn: 'root',
})
export class OfferService {
  // baseUrl = environment.apiBaseUrl + 'wp-json/api/' + environment.apiVersion + '/offer';
  // baseUrl = 'http://192.168.2.46:8001/offer/';
  baseUrl = 'http://dev.nguoidepsh.com/offer/';
  constructor(private http: HttpClient) {}
  getMyOfferList(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'me', getRequestOption());
  }
  getOfferList(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
  addNewOffer(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data, getRequestOption());
  }
}
