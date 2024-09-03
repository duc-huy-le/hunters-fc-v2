import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/Project';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Campaign } from '../../../models/Campaign';
import { CampaignService } from '../../../services/campaign/campaign.service';
import { checkResponseSuccess } from '../../../utils/Uitls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoadingService } from '../../../services/common/loading.service';
import { NzStatus } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-campaign-list-modal',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './campaign-list-modal.component.html',
  styleUrl: './campaign-list-modal.component.css',
})
export class CampaignListModalComponent {
  isVisible = false;
  title: string = 'Campaign click statistics';
  campaignList: Campaign[] = [];
  campaignAllClickData = [];
  today: Date = new Date();
  modalBodyStyle = {
    padding: '0 24px',
    height: '60vh',
    'overflow-y': 'auto',
  };
  adsCampaignIdInput: string = '';
  adsCampaignNameInput: string = '';
  project!: Project;
  isAddingCampaign: boolean = false;
  isLoadingSaveCampaignButton: boolean = false;
  adsCampaignNameInputStatus: NzStatus = '';
  adsCampaignIdInputStatus: NzStatus = '';

  constructor(
    private campaignService: CampaignService,
    private msg: NzMessageService,
    private loadingService: LoadingService
  ) {}
  async showModal(project: Project): Promise<void> {
    this.title = `${project?.name}'s campaign list`;
    this.isAddingCampaign = false;
    this.project = project;
    await this.getCampaignList();
    this.isVisible = true;
  }
  async getCampaignList() {
    try {
      const res = await this.campaignService
        .getCampaignListByProjectId(this.project?.id)
        .toPromise();
      if (res.code === 200) {
        this.campaignList = res?.data;
      } else {
        this.msg.error('Can not get campaign list');
      }
    } catch (e) {
      this.msg.error('Something went wrong. Please try again');
    } finally {
      this.loadingService.setLoading(false);
    }
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onClickAddCampaign() {
    this.isAddingCampaign = true;
  }
  onCancelAddCampaign() {
    this.isAddingCampaign = false;
  }
  async onSaveCampaign() {
    // Hiện khoanh đỏ những ô cần nhập mà chưa được nhập
    if (this.adsCampaignNameInput === '' || this.adsCampaignIdInput === '') {
      this.msg.error('Please enter campaign name and id');
      if (this.adsCampaignNameInput === '') {
        this.adsCampaignNameInputStatus = 'error';
      }
      if (this.adsCampaignIdInput === '') {
        this.adsCampaignIdInputStatus = 'error';
      }
      return;
    }
    this.isLoadingSaveCampaignButton = true;
    try {
      const payload = {
        name: this.adsCampaignNameInput,
        project_id: this.project?.id,
        campaign_id: this.adsCampaignIdInput,
      };
      const res = await this.campaignService
        .addNewCampaign(payload)
        .toPromise();
      if (res.code === 200) {
        this.getCampaignList();
        this.adsCampaignIdInput = '';
        this.adsCampaignNameInput = '';
        this.isAddingCampaign = false;
        this.msg.success('Save campaign successfully!');
        this.adsCampaignNameInputStatus = '';
        this.adsCampaignIdInputStatus = '';
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoadingSaveCampaignButton = false;
    }
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
}
