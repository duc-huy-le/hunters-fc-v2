import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Project } from '../../../models/Project';
import { ProjectService } from '../../../services/project/project.service';
import { RefService } from '../../../services/ref/ref.service';
import { Ref } from '../../../models/Ref';
import { RedirectService } from '../../../services/redirect/redirect.service';
import { convertObjectKeysToPascalCase } from '../../../utils/Uitls';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css',
})
export class RedirectComponent {
  isVisibleAddRedirectProfileModal: boolean = false;
  loadingTable: boolean = false;
  listOfData: any[] = [];
  addRedirectProfileForm!: FormGroup;
  projectList: Project[] = [];
  refList: Ref[] = [];
  conditionForm: FormRecord<FormControl<any>> = this.nnfb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  modalBodyStyle = {
    padding: '0 24px',
    height: '60vh',
    'overflow-y': 'auto',
  };
  profileOperatorList = [
    { value: 1, label: 'AND' },
    { value: 0, label: 'OR' },
  ];
  redirectTypeList = [
    { value: 1, label: 'Country' },
    { value: 2, label: 'IP' },
    { value: 3, label: 'VPS' },
  ];
  redirectOperatorList = [
    { value: 1, label: 'is' },
    { value: 0, label: 'is not' },
  ];
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private nnfb: NonNullableFormBuilder,
    private refService: RefService,
    private redirectService: RedirectService,
    private msg: NzMessageService
  ) {}
  async ngOnInit(): Promise<void> {
    this.initAddRedirectProfileForm();
  }
  initAddRedirectProfileForm() {
    this.addRedirectProfileForm = this.fb.group({
      redirectProfileName: [null, [Validators.required]],
      projectID: [null, [Validators.required]],
      active: [true, [Validators.required]],
      profileOperator: [1, [Validators.required]],
      offerID: [null, [Validators.required]],
      redirectConditions: this.fb.array([]),
    });
  }
  get redirectConditions() {
    return this.addRedirectProfileForm.controls[
      'redirectConditions'
    ] as FormArray;
  }
  reloadData() {
    // this.getPageData();
  }
  async getModalData() {
    this.loadingTable = true;
    await Promise.all([this.getRefData(), this.getProjectData()]).then(
      ([refRes, projectRes]) => {
        this.refList = refRes?.data;
        this.projectList = projectRes?.data;
      }
    );
  }
  async showAddRedirectProfileModal(): Promise<void> {
    if (this.projectList.length === 0 || this.refList.length === 0) {
      await this.getModalData();
    }
    this.isVisibleAddRedirectProfileModal = true;
    this.addMoreConditionRow();
  }
  async getProjectData() {
    let res;
    try {
      res = await this.projectService.getProjectList().toPromise();
    } catch (error) {
      console.error(error);
    } finally {
    }
    return res;
  }
  async getRefData() {
    let res;
    try {
      res = await this.refService.getRefList().toPromise();
    } catch (error) {
      console.error(error);
    } finally {
    }
    return res;
  }
  async viewCampaignList(project?: any) {
    // this.loadingService.setLoading(true)
    // await this.appCampaignListModal.showModal(project ?? this.selectingProject);
    // this.loadingService.setLoading(false)
  }
  handleCancelRedirectProfileModal() {
    this.isVisibleAddRedirectProfileModal = false;
    this.deleteAllRedirectConditionsForm();
  }
  addMoreConditionRow(data?: any) {
    this.redirectConditions.push(this.createItem(data));
  }
  createItem(data?: any): FormGroup {
    return this.fb.group({
      redirectTypeID: [data ? data.redirectTypeID : null],
      redirectOperatorID: [data ? data.redirectOperatorID : null],
      valueCondition: [data ? data.valueCondition : null],
    });
  }
  onClickDeleteRowRedirectConditionsForm(i: any) {
    this.redirectConditions.removeAt(i);
  }
  deleteAllRedirectConditionsForm() {
    this.redirectConditions.clear();
  }
  async handleAddRedirectProfileModal() {
    const payload = this.addRedirectProfileForm.getRawValue();
    if (payload?.redirectConditions.length > 0) {
      let index = 1;
      if (payload?.offerId) payload.offerId = Number(payload.offerId);
      if (payload?.projectId) payload.projectId = Number(payload.projectId);
      if (payload?.active === true) payload.active = 1;
      else payload.active = 0;
      payload?.redirectConditions?.forEach((data: any) => {
        data.orderIndex = index;
        index++;
      });
    }
    const finalPayload = convertObjectKeysToPascalCase(payload);
    await this.redirectService
      .addNewRedirectProfile(finalPayload)
      .toPromise()
      .then((res) => {
        if (res && res.code === 200) {
          this.msg.success('Redirect profile created successfully');
          this.isVisibleAddRedirectProfileModal = false;
        }
      });
  }
}
