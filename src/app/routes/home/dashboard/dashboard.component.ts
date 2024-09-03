import { Component, ViewChild } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartOptions,
  ChartType,
  registerables,
} from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { CommonModule, formatDate } from '@angular/common';
import { LoadingService } from '../../../services/common/loading.service';
import { ProjectService } from '../../../services/project/project.service';
import { RefService } from '../../../services/ref/ref.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { DatePipe } from '@angular/common';
import { CampaignService } from '../../../services/campaign/campaign.service';
import { Campaign } from '../../../models/Campaign';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Project } from '../../../models/Project';
import { CampaignClickStatisticsModalComponent } from '../../../components/modals/campaign-click-statistics-modal/campaign-click-statistics-modal.component';
import { handleCatchException } from '../../../utils/Uitls';
import { UserService } from '../../../shared/user/user.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { ChartHostComponent } from '../chart-host/chart-host.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    BaseChartDirective,
    CommonModule,
    CampaignClickStatisticsModalComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @ViewChild('campaignClickStatisticsModal')
  campaignClickStatisticsModal!: CampaignClickStatisticsModalComponent;
  today: Date = new Date();
  userTotalClick: number = 0;
  userTotalCost: number = 0;
  searchCampaignValue!: string;
  refCount: number = 0;
  projectCount: number = 0;
  campaignCount: number = 0;
  userInfo: any;
  clickBarChartLabels: string[] = [];
  clickBarChartData: number[] = [];
  campaignList: any[] = [];
  listViewCampaign: any[] = [];
  projectList: Project[] = [];
  userClickData: any[] = [];
  adsData: any[] = [];
  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private refService: RefService,
    private projectService: ProjectService,
    private userService: UserService,
    private datePipe: DatePipe,
    private campaignService: CampaignService,
    private msg: NzMessageService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }
  async ngOnInit() {
    this.loadingService.setLoading(true), this.handleClickBarChartLabels();
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userInfo = data;
    });
    await this.loadData();
  }
  async loadData() {
    this.loadingService.setLoading(true),
      await Promise.all([
        this.getAllDashboardData(),
        // this.getClickByUser(),
        // this.getRefData(),
        this.getProjectData(),
        // this.getCampaignData(),
        // this.getAdsData(),
      ])
        .then(() => {
          this.transformCampaignData();
        })
        .catch((error) => {
          handleCatchException(
            error,
            this.msg,
            'Đã xảy ra lỗi, không thể lấy dữ liệu!'
          );
          console.error(error);
        })
        .finally(() => {
          this.loadingService.setLoading(false);
        });
  }
  async getAllDashboardData() {
    await this.dashboardService.getAllDashboardData().toPromise().then((res) => {
      console.log(res);
      if (res) {
        const generalInfo = res?.data?.generalInfo;
        this.userTotalCost = generalInfo?.adsCosts;
        this.userTotalClick = generalInfo?.adsClicks;
        this.refCount = generalInfo?.refs;
        this.projectCount = generalInfo?.projects;
        this.campaignCount = generalInfo?.campaigns;
        const campaignList = res?.data?.campaignList;
        if (campaignList) {
          this.campaignList = campaignList;
          this.campaignList.reverse();
          this.listViewCampaign = campaignList;
        }
      }
    })
  }
  async getClickByUser() {
    const res = await this.dashboardService.getClickByUser().toPromise();
    // this.userTotalClick = res?.total ?? 0;
    this.userClickData = res?.data ?? [];
    this.handleClickBarChartData(res);
    this.chart.chart?.update(); // This is optional if you are using ng2-charts v2.x or above
  }
  async getRefData() {
    try {
      const res = await this.refService.getRefList().toPromise();
      // this.refCount = res?.total ?? 0;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
  async getProjectData() {
    try {
      const res = await this.projectService.getProjectList().toPromise();
      // this.projectCount = res?.total ?? 0;
      this.projectList = res?.data ?? [];
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
  async getCampaignData() {
    try {
      const res = await this.campaignService.getAllCampaignList().toPromise();
      if (res.code === 200) {
        // this.campaignList = res?.data;
        // this.campaignList.sort((a, b) => {
        //   const aCreatedAt = new Date(a.created_at).getTime();
        //   const bCreatedAt = new Date(b.created_at).getTime();
        //   return bCreatedAt - aCreatedAt;
        // });
        // this.listViewCampaign = [...this.campaignList];
        // this.campaignCount = res?.total;
      } else {
        this.msg.error('Không thể lấy danh sách chiến dịch');
      }
    } catch (e) {
      console.log(e);
    } finally {
      // this.loadingService.setLoading(false);
    }
  }
  async getAdsData() {
    try {
      this.loadingService.setLoading(true);
      await this.dashboardService
        .getRealAdsData()
        .toPromise()
        .then((res) => {
          if (res?.code === 200) {
            this.adsData = res?.data;
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      // this.loadingService.setLoading(false);
    }
  }
  handleClickBarChartLabels() {
    for (let i = 0; i < 7; i++) {
      if (i === 0) this.clickBarChartLabels.push('Today');
      else {
        const date = new Date();
        date.setDate(this.today.getDate() - i);
        this.clickBarChartLabels.push(this.datePipe.transform(date, 'dd/MM')!);
      }
    }
    this.clickBarChartLabels = this.clickBarChartLabels.reverse();
  }
  handleClickBarChartData(clickData: any) {
    for (let i = 0; i < 7; i++) {
      const chartDate = new Date();
      chartDate.setDate(this.today.getDate() - i);
      chartDate.setHours(0, 0, 0, 0);
      const todayClickData = clickData?.data?.filter((c: any) => {
        const clickDate = new Date(c.created_at);
        clickDate.setHours(0, 0, 0, 0);
        if (clickDate.getTime() === chartDate.getTime()) return true;
        else return false;
      });
      this.clickBarChartData.push(todayClickData?.length ?? 0);
    }
    this.clickBarChartData = this.clickBarChartData.reverse();
  }
  // public lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: [
  //     'Tháng 1',
  //     'Tháng 2',
  //     'Tháng 3',
  //     'Tháng 4',
  //     'Tháng 5',
  //     'Tháng 6',
  //     'Tháng 7',
  //     'Tháng 8',
  //     'Tháng 9',
  //     'Tháng 10',
  //     'Tháng 11',
  //     'Tháng 12',
  //   ],
  //   datasets: [
  //     {
  //       data: [120, 1231, 43, 465, 2523, 253, 484, 542],
  //       label: `Khoản chi năm ${this.today.getFullYear()}`,
  //       fill: true,
  //       tension: 0.5,
  //       borderColor: 'black',
  //       backgroundColor: 'rgba(255,0,0,0.3)',
  //     },
  //     {
  //       data: [1231, 3513, 321, 354, 3153, 315, 3132, 544],
  //       label: `Khoản chi năm ${this.today.getFullYear() - 1}`,
  //       fill: true,
  //       tension: 0.5,
  //       borderColor: 'black',
  //       backgroundColor: 'rgba(255,250,0,0.3)',
  //     },
  //   ],
  // };
  // public lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: [
  //     'Jan',
  //     'Feb',
  //     'Mar',
  //     'Apr',
  //     'May',
  //     'Jun',
  //     'Jul',
  //     'Aug',
  //     'Sep',
  //     'Oct',
  //     'Nov',
  //     'Dec',
  //   ],
  //   datasets: [
  //     {
  //       data: [10,20, 30],
  //       label: `Total costs ${this.today.getFullYear()}`,
  //       fill: true,
  //       tension: 0.5,
  //       borderColor: 'black',
  //       backgroundColor: 'rgba(255,0,0,0.3)',
  //     },
  //   ],
  // };
  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: false,
  // };
  public lineChartLegend = true;
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.clickBarChartLabels,
    datasets: [
      {
        data: this.clickBarChartData,
        label: `Số lượt nhấp chuột trong 7 ngày qua`,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: false,
  };
  public barChartLegend = true;

  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  transformCampaignData() {
    this.campaignList.forEach((c) => {
      // c.project_name = this.projectList.find(
      //   (p) => p.id === c.project_id
      // )?.name!;
      c.project_name = this.projectList.find(
        (p) => p.id === c.projectId
      )?.name!;
      // c.number_of_clicks = this.userClickData?.filter(
      //   (cl: any) =>
      //     cl.uri.includes(`asmid=${this.userInfo.uuid}`) &&
      //     (cl.uri.includes(`project=${c.name}`) ||
      //       cl.uri.includes(`asmcp=${c.project_id}`))
      // )?.length;
      c.number_of_clicks = this.userClickData?.filter(
        (cl: any) => cl.campaign_id === c.id
      )?.length;
      c.number_of_clicks_real = this.adsData
        ?.filter((a) => a.id === c.id)
        ?.reduce((a: any, b: any) => a + Number(b.click), 0);
      c.adsCost = this.adsData
        ?.filter((a) => a.id === c.id)
        ?.reduce((a: any, b: any) => a + Number(b.cost), 0);
    });
    // this.userTotalCost = this.campaignList.reduce(
    //   (a: any, b: any) => a + Number(b.adsCost),
    //   0
    // );
  }
  async onClickViewCampaignStatistic(campaign: Campaign) {
    // let campaignClickData = this.userClickData?.filter(
    //   (cl: any) =>
    //     cl.uri.includes(`asmid=${this.userInfo.uuid}`) &&
    //     (cl.uri.includes(`project=${campaign.name}`) ||
    //       cl.uri.includes(`asmcp=${campaign.project_id}`))
    // );
    // Ngày 04/08/2024: Đổi api dashboard nên comment các dòng sau
    // let campaignClickData = this.userClickData?.filter(
    //   (cl: any) => cl.campaign_id === campaign.id
    // );
    // let campaignAdsData = this.adsData?.filter(
    //   (a: any) => a.id === campaign.id
    // );
    this.campaignClickStatisticsModal.showModal(
      campaign
    );
    // this.campaignClickStatisticsModal.showModal(
    //   campaign,
    //   campaignClickData,
    //   campaignAdsData
    // );
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }
  onSearchCampaign(e: any) {
    this.listViewCampaign = this.campaignList.filter(
      (ref) =>
        // ref.name.toLowerCase().includes(e.toLowerCase()) ||
        // ref.id.toLowerCase().includes(e.toLowerCase())
        ref.campaignId.toLowerCase().includes(e.toLowerCase()) ||
        ref.campaignName.toLowerCase().includes(e.toLowerCase())
    );
  }
}
