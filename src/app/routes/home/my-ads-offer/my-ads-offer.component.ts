import { OfferService } from './../../../services/offer/offer.service';
import { Component, ViewChild } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { copyToClipboard, handleCatchException } from '../../../utils/Uitls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoadingService } from '../../../services/common/loading.service';
import { checkValidForm } from '../../../helpers/Helpers';
import { AdsOfferListComponent } from '../../../components/partials/ads-offer-list/ads-offer-list.component';
import { CreateOfferModalComponent } from '../../../components/modals/create-offer-modal/create-offer-modal.component';
@Component({
  selector: 'app-my-ads-offer',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdsOfferListComponent,
    CreateOfferModalComponent
  ],
  templateUrl: './my-ads-offer.component.html',
  styleUrl: './my-ads-offer.component.css',
})
export class MyAdsOfferComponent {
  @ViewChild('createOfferModal') createOfferModal!: CreateOfferModalComponent;
  adsOfferForm!: FormGroup;
  ticketForm!: FormGroup;
  searchAdsOfferValue!: string;
  loadingTable: boolean = false;
  isVisibleAddAdsOfferForm: boolean = false;
  isVisibleAddTicketForm: boolean = false;
  allOfferList: any[] = [];
  viewOfferList: any[] = [];
  adsOfferList: any[] = [];
  allAdsOfferList: any[] = [
    {
      id: 1,
      name: 'Lên quảng cáo cho dự án BingX',
      campaignId: 123456789,
      projectName: 'BingX',
      projectHomepage: 'https://bingx.com',
      cpc: 10000,
      duration: 30,
      price: 10000000,
      description: 'Đảm bảo lên đủ trong 15 ngày',
      status: 1,
      createdBy: 0,
      createdAt: '2024-06-11 11:11:11',
      lastModifiedBy: 0,
      lastModifiedAt: '2024-06-11 11:11:11',
    },
    {
      id: 2,
      name: 'Quảng bá thương hiệu Binance đỉnh cao',
      campaignId: 987654321,
      projectName: 'Binance',
      projectHomepage: 'https://binance.com',
      cpc: 15000,
      duration: 45,
      price: 20000000,
      description:
        'Với kinh nghiệm 4 năm chạy quảng cáo, tôi sẽ giúp tăng chi tiêu của bạn cho dự án Binance, đảm bảo nhìn thấy hiệu quả cao trong vòng 20 ngày.',
      status: 1,
      createdBy: 1,
      createdAt: '2024-06-12 09:22:33',
      lastModifiedBy: 1,
      lastModifiedAt: '2024-06-12 09:22:33',
    },
    {
      id: 3,
      name: 'Đẩy mạnh quảng cáo Bybit',
      campaignId: 1122334455,
      projectName: 'Bybit',
      projectHomepage: 'https://bybit.com',
      cpc: 12000,
      duration: 40,
      price: 15000000,
      description:
        'Tôi chuyên gia quảng cáo với 4 năm kinh nghiệm, sẽ tạo và tối ưu hóa chiến dịch quảng cáo google ads cho dự án Bybit, cam kết đạt mục tiêu trong 25 ngày.',
      status: 1,
      createdBy: 2,
      createdAt: '2024-06-13 14:45:56',
      lastModifiedBy: 2,
      lastModifiedAt: '2024-06-13 14:45:56',
    },
    {
      id: 4,
      name: 'Tiếp thị đột phá cho OKX',
      campaignId: 5566778899,
      projectName: 'OKX',
      projectHomepage: 'https://okx.com',
      cpc: 11000,
      duration: 35,
      price: 18000000,
      description:
        'Với bề dày kinh nghiệm, tôi sẽ giúp dự án OKX của bạn tăng trưởng về số CTR, đảm bảo chiến dịch đạt kết quả tối ưu trong 30 ngày.',
      status: 1,
      createdBy: 3,
      createdAt: '2024-06-14 08:33:22',
      lastModifiedBy: 3,
      lastModifiedAt: '2024-06-14 08:33:22',
    },
    {
      id: 5,
      name: 'Chiến dịch quảng cáo Exness hiệu quả',
      campaignId: 9988776655,
      projectName: 'Exness',
      projectHomepage: 'https://exness.com',
      cpc: 14000,
      duration: 50,
      price: 25000000,
      description:
        'Là chuyên gia trong lĩnh vực quảng cáo, tôi sẽ đảm bảo chiến dịch Exness đạt hiệu quả cao nhất trong 35 ngày, tối ưu chi phí và hiệu quả.',
      status: 1,
      createdBy: 4,
      createdAt: '2024-06-15 12:12:12',
      lastModifiedBy: 4,
      lastModifiedAt: '2024-06-15 12:12:12',
    },
  ];
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private offerService: OfferService
  ) { }
  async ngOnInit(): Promise<void> {
    this.initTicketForm();
    this.adsOfferList = [...this.allAdsOfferList];
    // Lấy danh sách offer của tôi
    await this.getAllMyOffers();
  }
  
  initTicketForm(): void {
    this.ticketForm = this.fb.group({
      name: [null, [Validators.required]],
      refLink: [null, [Validators.required]],
      cpc: [null, [Validators.required]],
      countries: [null, [Validators.required]],
      keywords: [null, [Validators.required]],
      devices: [null, [Validators.required]],
      offerId: [null, [Validators.required]],
      status: ['INACTIVE', [Validators.required]],
    });
  }
  reloadData(): void { }
  showAdsOfferModal(): void {
    // this.isVisibleAddAdsOfferForm = true;
    this.createOfferModal.openModal();
  }
  showTicketModal(): void {
    this.isVisibleAddTicketForm = true;
  }
  onSearchAdsOffer(event: string): void { }
  handleCancelAdsOfferForm(): void {
    this.isVisibleAddAdsOfferForm = false;
  }
  handleCancelTicketForm(): void {
    this.isVisibleAddTicketForm = false;
  }
  handleAddAdsOffer(): void {
    checkValidForm(this.adsOfferForm);
    if (this.adsOfferForm.valid) {
      this.loadingService.setLoading(true);
      let payload = this.adsOfferForm.getRawValue();
      payload.product_detail = {
        campaign_id: payload.campaignId,
        project_url: payload.projectHomepage,
        project_name: payload.projectName,
        cpc: payload.cpc,
      };
      this.offerService
        .addNewOffer(payload)
        .toPromise()
        .then((res) => {
          if (res) {
            this.msg.success('Tạo suất bán thành công!');
            this.getAllMyOffers();
          } else {
            this.msg.error('Đã xảy ra lỗi, không thể tạo suất bán!');
          }
        })
        .catch((error) => {
          handleCatchException(
            error,
            this.msg,
            'Đã xảy ra lỗi, không thể tạo suất bán!'
          );
          console.error(error);
        })
        .finally(() => {
          this.loadingService.setLoading(false);
          this.isVisibleAddAdsOfferForm = false;
        });
    }
  }
  handleAddTicket(): void { }

  // Khai báo hàm lấy dánh sách tất cả các offer của tôi
  async getAllMyOffers(): Promise<void> {
    this.loadingService.setLoading(true);
    this.offerService
      .getMyOfferList()
      .toPromise()
      .then((res) => {
        if (res && res.code === 200 && res?.data) {
          this.allOfferList = res?.data;
          this.allAdsOfferList = this.allOfferList.sort((a, b) => {
            const aCreatedAt = new Date(a.created_at).getTime();
            const bCreatedAt = new Date(b.created_at).getTime();
            return bCreatedAt - aCreatedAt;
          });
          this.viewOfferList = [...this.allOfferList];
        } else {
          this.msg.error('Đã xảy ra lỗi, không thể lấy danh sách!');
        }
      })
      .catch((error) => {
        handleCatchException(
          error,
          this.msg,
          'Đã xảy ra lỗi, không thể lấy danh sách!'
        );
        console.error(error);
      })
      .finally(() => {
        this.loadingService.setLoading(false);
      });
  }
}
