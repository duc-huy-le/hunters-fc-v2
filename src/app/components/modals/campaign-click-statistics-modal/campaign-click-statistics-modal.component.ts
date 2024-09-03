import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { Campaign } from '../../../models/Campaign';
import { Click } from '../../../models/Click';
import { ExportService } from '../../../services/export/export-data.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { handleCatchException } from '../../../utils/Uitls';
import { LoadingService } from '../../../services/common/loading.service';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

interface ClicksPerDay {
  date: Date;
  // numberOfClicks: number;
  // realClicks: number;
  // cost: number;
  systemClicks: number;
  adsClicks: number;
  adsCosts: number;
}
@Component({
  selector: 'app-campaign-click-statistics-modal',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, FormsModule],
  templateUrl: './campaign-click-statistics-modal.component.html',
  styleUrl: './campaign-click-statistics-modal.component.css',
})
export class CampaignClickStatisticsModalComponent {
  today: Date = new Date();
  exportStartDate: Date | null = new Date(this.today.setHours(0, 0, 0, 0));
  exportEndDate: Date | null = new Date();
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.exportEndDate) {
      return false;
    }
    return startValue.getTime() > this.exportEndDate.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.exportStartDate) {
      return false;
    }
    return endValue.getTime() <= this.exportStartDate.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  openExportOptionModal(): void {
    this.isVisibleExportOptionModal = true;
  }
  handleCancelExport(): void {
    this.isVisibleExportOptionModal = false;
    const today = new Date();
    this.exportEndDate = new Date();
    this.exportStartDate = new Date(today.setHours(0, 0, 0, 0));
  }
  @ViewChild('loadingExportExcelTemplate') loadingExportExcelTemplate!: TemplateRef<void>;
  isVisibleExportOptionModal: boolean = false;
  exportExcelPercent: number = 0;
  // exportStartDate: Date = new Date();
  // exportEndDate: Date = new Date();
  nameCampaign: string = 'Chiến dịch';
  // campaign!: Campaign;
  campaign!: any;
  isVisible = false;
  title: string = 'Thống kê click của chiến dịch';
  campaignAllClickData: Click[] = [];
  clicksPerDayData: ClicksPerDay[] = [];
  modalBodyStyle = {
    padding: '0 24px',
    height: '65vh',
    'overflow-y': 'auto',
  };
  projectAllClickTablePage: number = 1;
  projectAllClickTablePageSize: number = 10;
  projectAllClickTableTotalRecord!: number;
  constructor(private exportData: ExportService,
    private dashboardService: DashboardService,
    private msg: NzMessageService,
    private loadingService: LoadingService
  ) { }
  async showModal(
    campaign: any
  ): Promise<void> {
    this.projectAllClickTablePage = 1; // Reset page về 1
    this.projectAllClickTablePageSize = 10; // Reset page size về 10
    this.campaign = campaign;
    this.nameCampaign = campaign?.campaignName;
    await this.getCampaignData(campaign);
  }
  async getCampaignData(campaign: any): Promise<void> {
    this.loadingService.setLoading(true);
    await this.dashboardService.getClickByCampaign(campaign?.campaignId, this.projectAllClickTablePage, this.projectAllClickTablePageSize).toPromise().then((res) => {
      if (res) {
        const clickList = res?.data?.clickList;
        const detailStatistic = res?.data?.detailStatistic;
        this.projectAllClickTableTotalRecord = res?.data?.totalRecord;
        this.title = `Thống kê click ${campaign?.campaignName} - Tổng số click: ${this.projectAllClickTableTotalRecord}`;
        this.clicksPerDayData = [...detailStatistic];
        this.campaignAllClickData = [...clickList];
      }
    }).catch((err) => {
      handleCatchException(err, this.msg, "Không thế lấy thống tin thống kê. Vui lòng thử lại");
      console.log(err);
    }).finally(() => {
      this.isVisible = true;
      this.loadingService.setLoading(false);
    })
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // handleExport(): void {
  //   this.msg.loading(this.loadingExportExcelTemplate);
  //   // let dataSheet: any[] = this.campaignAllClickData.map((element) => {
  //   //   {
  //   //     return {
  //   //       Time: element?.created_at,
  //   //       Browser: element?.browser,
  //   //       OS: element?.os,
  //   //       Language: element?.lang,
  //   //       Country: element?.country,
  //   //       City: element?.city,
  //   //       VPN: element?.vpn == 'Y' ? 'Yes' : element?.vpn == 'N' ? 'No' : '',
  //   //       ISP: element?.isp,
  //   //       IP: element?.ip,
  //   //       Redirect: element?.redirect,
  //   //     };
  //   //   }
  //   // });
  //   // let date = new Date();
  //   // const padStart = (value: number): string => value.toString().padStart(2, '0');
  //   // let fileName = `${this.nameCampaign.replaceAll(' ', '_')}-${padStart(date.getDay())}-${padStart(date.getMonth())}-${date.getFullYear()}-${padStart(date.getHours())}h${padStart(date.getMinutes())}`;
  //   // this.exportData.exportExcel(dataSheet, fileName);
  // }

  handleExport(): void {
    this.msg.loading(this.loadingExportExcelTemplate);
    // let dataSheet: any[] = this.campaignAllClickData.map((element) => {
    //   {
    //     return {
    //       Time: element?.created_at,
    //       Browser: element?.browser,
    //       OS: element?.os,
    //       Language: element?.lang,
    //       Country: element?.country,
    //       City: element?.city,
    //       VPN: element?.vpn == 'Y' ? 'Yes' : element?.vpn == 'N' ? 'No' : '',
    //       ISP: element?.isp,
    //       IP: element?.ip,
    //       Redirect: element?.redirect,
    //     };
    //   }
    // });
    // let date = new Date();
    // const padStart = (value: number): string => value.toString().padStart(2, '0');
    // let fileName = `${this.nameCampaign.replaceAll(' ', '_')}-${padStart(date.getDay())}-${padStart(date.getMonth())}-${date.getFullYear()}-${padStart(date.getHours())}h${padStart(date.getMinutes())}`;
    // this.exportData.exportExcel(dataSheet, fileName);
  }

  // async handleExportAllData(): Promise<void> {
  //   const campaign = this.campaign;
  //   this.msg.loading(this.loadingExportExcelTemplate, { nzDuration: 0 });
  //   let allData: any[] = [];
  //   let page = 1;
  //   let pageSize = 10000;
  //   // let pageSize = 20;
  //   let totalRecords = 0;

  //   const padStart = (value: number): string => value.toString().padStart(2, '0');
  //   const date = new Date();
  //   let fileName = `${campaign.campaignName.replaceAll(' ', '_')}-${padStart(date.getDate())}-${padStart(date.getMonth() + 1)}-${date.getFullYear()}-${padStart(date.getHours())}h${padStart(date.getMinutes())}`;

  //   try {
  //     do {
  //       const res = await this.dashboardService.getClickByCampaign(campaign?.campaignId, page, pageSize).toPromise();

  //       if (res) {
  //         const clickList = res?.data?.clickList;
  //         totalRecords = res?.data?.totalRecord;

  //         const dataSheet = clickList.map((element: any) => {
  //           return {
  //             Time: element?.created_at,
  //             Browser: element?.browser,
  //             OS: element?.os,
  //             Language: element?.lang,
  //             Country: element?.country,
  //             City: element?.city,
  //             VPN: element?.vpn == 'Y' ? 'Yes' : element?.vpn == 'N' ? 'No' : '',
  //             ISP: element?.isp,
  //             IP: element?.ip,
  //             Redirect: element?.redirect,
  //           };
  //         });

  //         allData = allData.concat(dataSheet);
  //         page++;
  //         this.exportExcelPercent = Math.floor((allData.length / this.projectAllClickTableTotalRecord) * 100);
  //       } else {
  //         break; // Nếu không có dữ liệu trả về, thoát vòng lặp
  //       }

  //     } while (allData.length < totalRecords);
  //     this.msg.remove();
  //     // Xuất toàn bộ dữ liệu ra Excel
  //     this.exportData.exportExcel(allData, fileName);
  //     this.msg.success("Xuất file excel thành công!")

  //   } catch (err) {
  //     handleCatchException(err, this.msg, "Không thế lấy thông tin thống kê. Vui lòng thử lại");
  //     console.log(err);
  //   } finally {
  //     this.loadingService.setLoading(false);
  //   }
  // }
  async handleExportAllData(): Promise<void> {
    this.exportExcelPercent = 0;
    const campaign = this.campaign;
    // const startDate = new Date(this.exportStartDate!.setHours(0, 0, 0, 0));
    // const endDate = new Date(this.exportEndDate!.setHours(23, 59, 59, 999));
    const startDate = this.exportStartDate;
    const endDate = this.exportEndDate;

    this.msg.loading(this.loadingExportExcelTemplate, { nzDuration: 0 });
    let allData: any[] = [];
    let page = 1;
    // let pageSize = 10000;
    let pageSize = 1000;
    let totalRecords = 0;

    const padStart = (value: number): string => value.toString().padStart(2, '0');
    const date = new Date();
    let fileName = `${campaign.campaignName.replaceAll(' ', '_')}-${padStart(date.getDate())}-${padStart(date.getMonth() + 1)}-${date.getFullYear()}-${padStart(date.getHours())}h${padStart(date.getMinutes())}`;

    try {
      do {
        const res = await this.dashboardService.getClickByCampaign(campaign?.campaignId, page, pageSize).toPromise();

        if (res) {
          const clickList = res?.data?.clickList;
          totalRecords = res?.data?.totalRecord;

          // Lọc các bản ghi theo khoảng thời gian đã chọn
          const filteredClickList = clickList.filter((element: any) => {
            const createdAt = new Date(element?.created_at);
            return createdAt >= startDate! && createdAt <= endDate!;
          });

          const dataSheet = filteredClickList.map((element: any) => {
            return {
              Time: element?.created_at,
              Browser: element?.browser,
              OS: element?.os,
              Language: element?.lang,
              Country: element?.country,
              City: element?.city,
              VPN: element?.vpn == 'Y' ? 'Yes' : element?.vpn == 'N' ? 'No' : '',
              ISP: element?.isp,
              IP: element?.ip,
              Redirect: element?.redirect,
            };
          });

          allData = allData.concat(dataSheet);
          page++;
          this.exportExcelPercent = Math.floor((allData.length / this.projectAllClickTableTotalRecord) * 100);

          // Kiểm tra nếu toàn bộ bản ghi đã được lọc theo thời gian
          // Nếu không có bản ghi nào thỏa mãn, mà end date đã lớn hơn bản ghi đầu tiên rồi thì break
          if ((filteredClickList.length === 0 && clickList.length === 0) || (filteredClickList.length === 0 && new Date(clickList[pageSize - 1]) < this.exportEndDate!)) break;

        } else {
          break; // Nếu không có dữ liệu trả về, thoát vòng lặp
        }

      } while (allData.length < totalRecords);

      this.msg.remove();
      // Xuất toàn bộ dữ liệu ra Excel
      this.exportData.exportExcel(allData, fileName);
      this.msg.success("Xuất file excel thành công!");

    } catch (err) {
      handleCatchException(err, this.msg, "Không thế lấy thông tin thống kê. Vui lòng thử lại");
      console.log(err);
    } finally {
      this.loadingService.setLoading(false);
    }
  }



  async projectAllClickTablePageChange(event: any): Promise<void> {
    this.projectAllClickTablePage = event;
    await this.getCampaignData(this.campaign);
  }
  async projectAllClickTablePageSizeChange(event: any): Promise<void> {
    this.projectAllClickTablePage = 1; // Reset lại về page 1 khi thay đổi pagesize
    this.projectAllClickTablePageSize = event;
    await this.getCampaignData(this.campaign);
  }
}
