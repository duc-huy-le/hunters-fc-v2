import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { BaseComponent } from '../../common/base/base.component';
import { LoadingService } from '../../../services/common/loading.service';
import { Ref } from '../../../models/Ref';
import {
  checkResponseSuccess,
  handleCatchException,
} from '../../../utils/Uitls';
import { checkValidForm } from '../../../helpers/Helpers';
import { CampaignService } from '../../../services/campaign/campaign.service';
import { Campaign } from '../../../models/Campaign';
import { ProjectService } from '../../../services/project/project.service';
import { Project } from '../../../models/Project';
import { UserService } from '../../../shared/user/user.service';

@Component({
  selector: 'app-campaign',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
})
export class CampaignComponent {
  dataForm!: FormGroup;
  listOfTagOptions: string[] = [];
  listOfOption: string[] = [];
  listOfData: Campaign[] = [];
  listViewCampaign: Campaign[] = [];
  searchValue!: string;
  loadingTable: boolean = false;
  projectList: Project[] = [];
  userUuid!: string;
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userUuid = data?.uuid;
    });
    this.initDataForm();
    this.getPageData();
  }
  initDataForm() {
    this.dataForm = this.fb.group({
      campaign_id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      project_id: [null, [Validators.required]],
    });
  }
  async getPageData() {
    this.loadingTable = true;
    Promise.all([this.getCampaignData(), this.getProjectData()])
      .then(() => {
        this.transformData();
      })
      .finally(() => {
        this.loadingTable = false;
      });
  }
  async getCampaignData() {
    this.loadingTable = true;
    try {
      const res = await this.campaignService.getAllCampaignList().toPromise();
      this.listOfData = res?.data;
      this.listViewCampaign = [...this.listOfData];
      this.listViewCampaign.sort((a, b) => {
        const aCreatedAt = new Date(a.created_at).getTime();
        const bCreatedAt = new Date(b.created_at).getTime();
        return bCreatedAt - aCreatedAt;
      });
    } catch (error) {
      handleCatchException(
        error,
        this.msg,
        'Đã xảy ra lỗi, không thể lấy danh sách chiến dịch!'
      );
      console.error(error);
    } finally {
      this.loadingTable = false;
    }
  }
  async getProjectData() {
    try {
      const res = await this.projectService.getProjectList().toPromise();
      this.projectList = res?.data;
      this.projectList.sort((a, b) => {
        const aCreatedAt = new Date(a.created_at).getTime();
        const bCreatedAt = new Date(b.created_at).getTime();
        return bCreatedAt - aCreatedAt;
      });
    } catch (error) {
      handleCatchException(
        error,
        this.msg,
        'Đã xảy ra lỗi, không thể lấy danh sách dự án!'
      );
    }
  }
  reloadData() {
    this.getPageData();
  }
  async addNewData() {
    checkValidForm(this.dataForm);
    if (this.dataForm.valid) {
      this.loadingService.setLoading(true);
      if (this.dataForm.valid) {
        try {
          const res = await this.campaignService
            .addNewCampaign(this.dataForm.value)
            .toPromise();
          if (res?.code === 200) {
            this.msg.success('Tạo chiến dịch thành công!');
            this.isVisible = false;
          } else {
            this.msg.error('Đã xảy ra lỗi, không thể tạo chiến dịch!');
          }
          await this.getPageData();
        } catch (error) {
          handleCatchException(
            error,
            this.msg,
            'Đã xảy ra lỗi, không thể tạo chiến dịch!'
          );
          console.error(error);
        } finally {
          this.loadingService.setLoading(false);
        }
      }
    }
  }
  betaMessage(event: any) {
    if (event && event?.length > 0)
      this.msg.info('Tính năng tìm kiếm hiện đang được phát triển!');
  }
  isVisible = false;

  showRefModal(): void {
    this.isVisible = true;
  }

  async handleAddData(): Promise<void> {
    await this.addNewData();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
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

  onSearch(e: any) {
    this.listViewCampaign = this.listOfData.filter(
      (ref) =>
        ref.name.toLowerCase().includes(e.toLowerCase()) ||
        ref.project_id.toLowerCase().includes(e.toLowerCase()) ||
        ref.id.toLowerCase().includes(e.toLowerCase())
    );
  }
  transformData() {
    this.listOfData?.forEach((c) => {
      c.project_name = this.projectList?.find(
        (p) => p.id === c.project_id
      )?.name!;
    });
  }
  confirmDelete(id: any) {
    this.loadingTable = true;
    this.campaignService
      .deleteCampaign({ campaign_id: id, uuid: this.userUuid })
      .toPromise()
      .then(() => {
        this.msg.success('Xóa chiến dịch thành công!');
        // this.getPageData();
        this.removeDeletedRecordFromList(id);
      })
      .catch((error) => {
        handleCatchException(
          error,
          this.msg,
          'Đã xảy ra lỗi, không thể xóa chiến dịch!'
        );
        console.error(error);
      })
      .finally(() => {
        this.loadingTable = false;
      });
  }

  removeDeletedRecordFromList(id: any) {
    this.listViewCampaign = this.listViewCampaign.filter((c) => c.id !== id);
  }
}
