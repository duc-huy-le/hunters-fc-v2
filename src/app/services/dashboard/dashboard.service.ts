import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getRequestOption } from '../../helpers/Helpers';
import { UserService } from '../../shared/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.apiBaseUrl + 'wp-json/api/' + environment.apiVersion;

  constructor(private http: HttpClient, private userService: UserService) { }
  getClickByUser(page: number = 1, pageSize: number = 99999): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/click' + '?page=' + page + '&per_page=' + pageSize,
      getRequestOption()
    );
  }
  getRealAdsData(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/campaign_stat',
      getRequestOption()
    );
  }
  getAllDashboardData(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/dashboard',
      getRequestOption()
    );
  }
  getClickByCampaign(campaignId: any, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + `/click/campaign/${campaignId}?page=${page}&per_page=${pageSize}`,
      getRequestOption()
    );
  }
}
