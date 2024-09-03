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
import {
  AdsOfferListComponent,
  AdsOfferListType,
} from '../../../components/partials/ads-offer-list/ads-offer-list.component';
import { CooperateTicketComponent } from '../../../components/partials/cooperate-ticket/cooperate-ticket.component';
import { OfferService } from '../../../services/offer/offer.service';

@Component({
  selector: 'app-ads-market',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdsOfferListComponent,
  ],
  templateUrl: './ads-market.component.html',
  styleUrl: './ads-market.component.css',
})
export class AdsMarketComponent {
  readonly AdsOfferListType = AdsOfferListType;
  allOfferList: any[] = [];
  viewOfferList: any[] = [];
  adsOfferForm!: FormGroup;
  searchAdsOfferValue!: string;
  loadingTable: boolean = false;
  isVisibleAddAdsOfferForm: boolean = false;
  isVisibleAddTicketForm: boolean = false;
  adsOfferList: any[] = [];
  allAdsOfferList: any[] = [
    {
      id: 1,
      name: 'Lên quảng cáo cho dự án BingX',
      campaignId: 123456789,
      projectName: 'BingX',
      projectHomepage: 'https://bingx.com',
      cpc: 10000,
      minimumCommittedDays: 30,
      minimumBudget: 10000000,
      note: 'Đảm bảo lên đủ trong 15 ngày',
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
      minimumCommittedDays: 45,
      minimumBudget: 20000000,
      note: 'Với kinh nghiệm 4 năm chạy quảng cáo, tôi sẽ giúp tăng chi tiêu của bạn cho dự án Binance, đảm bảo nhìn thấy hiệu quả cao trong vòng 20 ngày.',
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
      minimumCommittedDays: 40,
      minimumBudget: 15000000,
      note: 'Tôi chuyên gia quảng cáo với 4 năm kinh nghiệm, sẽ tạo và tối ưu hóa chiến dịch quảng cáo google ads cho dự án Bybit, cam kết đạt mục tiêu trong 25 ngày.',
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
      minimumCommittedDays: 35,
      minimumBudget: 18000000,
      note: 'Với bề dày kinh nghiệm, tôi sẽ giúp dự án OKX của bạn tăng trưởng về số CTR, đảm bảo chiến dịch đạt kết quả tối ưu trong 30 ngày.',
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
      minimumCommittedDays: 50,
      minimumBudget: 25000000,
      note: 'Là chuyên gia trong lĩnh vực quảng cáo, tôi sẽ đảm bảo chiến dịch Exness đạt hiệu quả cao nhất trong 35 ngày, tối ưu chi phí và hiệu quả.',
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
  ) {}
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.adsOfferList = [...this.allAdsOfferList];
    // Lấy danh sách offer của tôi
    await this.getAllOffers();
  }
  initForm(): void {
    this.adsOfferForm = this.fb.group({
      name: [null, [Validators.required]],
      campaignId: [null, [Validators.required]],
      projectName: [null, [Validators.required]],
      projectHomepage: [null, [Validators.required]],
      cpc: [null, [Validators.required]],
      minimumCommittedDays: [1, [Validators.required]],
      minimumBudget: [1000, [Validators.required]],
      note: [null, [Validators.required]],
      status: [2, [Validators.required]],
    });
  }

  reloadData(): void {}
  showAdsOfferModal(): void {
    this.isVisibleAddAdsOfferForm = true;
  }
  showTicketModal(): void {
    this.isVisibleAddTicketForm = true;
  }
  onSearchAdsOffer(event: string): void {}
  handleCancelAdsOfferForm(): void {
    this.isVisibleAddAdsOfferForm = false;
  }
  handleCancelTicketForm(): void {
    this.isVisibleAddTicketForm = false;
  }
  handleAddAdsOffer(): void {
    checkValidForm(this.adsOfferForm);
    if (this.adsOfferForm.invalid) return;
    if (this.adsOfferForm.valid) {
      this.adsOfferList.push({
        ...this.adsOfferForm.value,
        createdAt: new Date(),
      });
      this.isVisibleAddAdsOfferForm = false;
    }
  }
  handleAddTicket(): void {}
  async getAllOffers(): Promise<void> {
    this.loadingService.setLoading(true);
    this.offerService
      .getOfferList()
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
