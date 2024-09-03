import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectResourceService {

  constructor(private http:HttpClient) {}
    googleSheetUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=N-VXxouisKz727KCo_n94x6XNBcFTpIxmfKtpT7TwTSo7elsOA6zk9micchZB04kZk39PEghOOYI6HLIgiGX4X9PwQuSkYXTm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJIcIWGjhepahhvf0kGWMPgksnaKkOrv_6QTyBOVZ1kfGhukr8RMs2slkA0V01qRxU2s6-mNSF73ixkSoRbnLlJXDvwXkg0_pg&lib=MNRMjOkfNC5LUyQiuqF2GTxpwP_ZA5K-k';

    getGoogleSheetValue():Observable<any>{
        return this.http.get(this.googleSheetUrl);
    }
}
