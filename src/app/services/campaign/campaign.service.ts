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
export class CampaignService {
  baseUrl =
    environment.apiBaseUrl +
    'wp-json/api/' +
    environment.apiVersion +
    '/campaign';
  userInfo: any = JSON.parse(localStorage.getItem(USER_INFO)!);
  constructor(private http: HttpClient) {}
  getAllCampaignList(): Observable<any> {
    return this.http.get<any>(this.baseUrl, getRequestOption());
  }
  getCampaignListByProjectId(projectId: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '?project_id=' + projectId,
      getRequestOption()
    );
  }
  addNewCampaign(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data, getRequestOption());
  }
  deleteCampaign(data: any): Observable<any> {
    return this.http.request<any>('DELETE', this.baseUrl, {
      ...getRequestOption(),
      body: data,
    });
  }
}
