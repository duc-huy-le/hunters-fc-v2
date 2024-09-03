import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getRequestOption } from '../../helpers/Helpers';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  baseUrl =
    environment.apiBaseUrl +
    'wp-json/api/' +
    environment.apiVersion +
    '/user/transaction';
  constructor(private http: HttpClient) {}
  getAllUserTransaction(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
  // getCampaignListByProjectId(projectId: string): Observable<any> {
  //   return this.http.get<any>(
  //     this.baseUrl + '?project_id=' + projectId,
  //     getRequestOption()
  //   );
  // }
  // addNewCampaign(data: any): Observable<any> {
  //   return this.http.post<any>(this.baseUrl, data, getRequestOption());
  // }
}
