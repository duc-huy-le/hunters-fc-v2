import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { checkValidForm } from '../../../helpers/Helpers';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../../services/common/loading.service';
import { OfferService } from '../../../services/offer/offer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { handleCatchException } from '../../../utils/Uitls';

@Component({
  selector: 'app-create-offer-modal',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-offer-modal.component.html',
  styleUrl: './create-offer-modal.component.css'
})
export class CreateOfferModalComponent {
  isVisible: boolean = false;
  adsOfferForm!: FormGroup;
  // Danh sách các loại dịch vụ
  offerTypeList: any[] = [
    {
      id: 'RENT',
      name: 'Thuê',
    },
  ];
  // Danh sách các loại sản phẩm
  productTypeList: any[] = [
    {
      id: 'ACCOUNT',
      name: 'Tài khoản ads',
    },
  ];
  // Danh sách các trạng thái offer
  publishStatusList: any[] = [
    {
      id: 'PRIVATE',
      name: 'Riêng tư',
    },
    {
      id: 'PUBLIC',
      name: 'Công khai',
    },
  ];
  // Input formats
  formatterBenefitPercent = (value: number): string => value != null ? `${value} % chi tiêu ads` : '';
  parserBenefitPercent = (value: string): string => value.replace(' % chi tiêu ads', '');
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private offerService: OfferService,
    private msg: NzMessageService,

  ) { }
  initForm(): void {
    this.adsOfferForm = this.fb.group({
      name: [null, [Validators.required]],
      campaignId: [null],
      projectName: [null, [Validators.required]],
      projectHomepage: [null, [Validators.required]],
      cpc: [null, [Validators.required]],
      benefit: [null, [Validators.required]],
      duration: [1, [Validators.required]],
      price: [1000, [Validators.required]],
      description: [null, [Validators.required]],
      status: ['INACTIVE', [Validators.required]],
      offer_type: ['RENT', [Validators.required]], // Loại dịch vụ
      product_type: ['ACCOUNT', [Validators.required]], // Loại sản phẩm
      publish_status: ['PUBLIC', [Validators.required]], // Chế độ hiển thị
    });
  }
  openModal(): void {
    this.initForm();
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
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
            // this.getAllMyOffers(); // Comment dòng này vì copy từ màn list sang mà đây chỉ là modal thôi không liên quan đến list
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
          this.isVisible = false;
        });
    }
  }
  // Khai báo hàm lấy dánh sách tất cả các offer của tôi
}
