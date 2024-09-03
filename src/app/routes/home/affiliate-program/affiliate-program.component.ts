import { Component } from '@angular/core';
import { UserService } from '../../../shared/user/user.service';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-affiliate-program',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule],
  templateUrl: './affiliate-program.component.html',
  styleUrl: './affiliate-program.component.css',
})
export class AffiliateProgramComponent {
  userInfo: any;
  userRefLink: string = '';
  loadingTable: boolean = false;
  listOfData: any[] = [];
  totalRef: any = 'N/A';
  totalCommission: any = 'N/A';
  constructor(
    private userService: UserService,
    private msg: NzMessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userInfo = data;
      this.userRefLink = `https://asmlink.com/giai-phap-boc-link-google-ads?asmrf=${this.userInfo?.uuid}`;
    });
    this.getAffiliateData();
  }
  copyRefLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.userRefLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.msg.success('Your ref link has been copied to clipboard');
  }
  getAffiliateData() {
    this.userService
      .getAffiliateData()
      .toPromise()
      .then((res) => {
        if (res && res.code === 200 && res.data) {
          this.totalRef = res.data?.refs;
          this.totalCommission = res.data?.paid;
          this.listOfData = res.data?.users.map((element: any) => {
            const tempString: String[] =
              element.email.match(/(.{2}).+(.)(?=@)/);
            element.email = element.email?.replace(
              /(.{2}).+(.)(?=@)/,
              '$1' +
                '*'.repeat(
                  tempString[0].length -
                    tempString[1].length -
                    tempString[2].length
                ) +
                '$2'
            );
            return element;
          });
          this.listOfData.sort((a, b) => {
            const aCreatedAt = new Date(a.created_at).getTime();
            const bCreatedAt = new Date(b.created_at).getTime();
            return bCreatedAt - aCreatedAt;
          });
        }
      });
  }
}
