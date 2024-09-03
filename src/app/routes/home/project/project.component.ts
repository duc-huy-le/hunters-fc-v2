import { Role } from './../../../shared/auth/auth.service';
import { CampaignService } from './../../../services/campaign/campaign.service';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { Project } from '../../../models/Project';
import { ProjectService } from '../../../services/project/project.service';
import { LoadingService } from '../../../services/common/loading.service';
import { Ref } from '../../../models/Ref';
import { RefService } from '../../../services/ref/ref.service';
import { BaseComponent } from '../../common/base/base.component';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { CampaignClickStatisticsModalComponent } from '../../../components/modals/campaign-click-statistics-modal/campaign-click-statistics-modal.component';
import {
  checkResponseSuccess,
  handleCatchException,
} from '../../../utils/Uitls';
import { CampaignListModalComponent } from '../../../components/modals/campaign-list-modal/campaign-list-modal.component';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { UserService } from '../../../shared/user/user.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { Campaign } from '../../../models/Campaign';
import { ProjectTypeService } from '../../../services/project-type/project-type.service';

export enum ProjectModalMode {
  ADD,
  EDIT,
  VIEW,
}
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CampaignClickStatisticsModalComponent,
    CampaignListModalComponent,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent extends BaseComponent {
  @ViewChild('projectClickStatisticsModal')
  projectClickStatisticsModal!: CampaignClickStatisticsModalComponent;
  @ViewChild('appCampaignListModal')
  appCampaignListModal!: CampaignListModalComponent;
  readonly ProjectModalMode = ProjectModalMode;
  readonly Role = Role;
  isVisible: boolean = false;
  searchProjectValue!: string;
  projectForm!: FormGroup;
  listOfTagOptions: string[] = [];
  listOfOption: string[] = [];
  loadingTable: boolean = false;
  refList: Ref[] = [];
  availableRefList: Ref[] = [];
  listOfData: Project[] = [];
  listViewProject: Project[] = [];
  userClickData: any;
  selectingProject!: Project;
  modalBodyStyle = {
    padding: '0 24px',
    height: '60vh',
    'overflow-y': 'auto',
  };
  addProjectStep: number = 1;
  projectTypeList: any[] = []; // Lưu danh sách các loại dự án mà người dùng có thể tạo
  availableProjectTypeList: any[] = [
    {
      id: '1',
      name: 'Thống kê click',
      color: 'blue',
    },
    {
      id: '2',
      name: 'Bọc link và chuyển hướng',
      color: 'green',
    },
  ];
  projectModalMode!: ProjectModalMode;
  expandSet = new Set<number>();
  redirectProfileModel: any = {};
  isShowConditionErrorTip: boolean = false;
  initialRedirectCondition: any = {
    RedirectConditionID: null,
    RedirectProfileID: null,
    OrderIndex: '1',
    RedirectTypeID: null,
    RedirectOperatorID: null,
    ValueCondition: null,
  };
  initialRedirectProfileModel: any = {
    RedirectProfileID: '',
    ProjectID: '',
    RedirectProfileName: '',
    ProfileOperator: '',
    OfferID: '',
    RedirectUrl: '',
    Active: '1',
    RedirectTypeID: '2',
    Probability: '0',
    uuid: '',
    id: '',
    name: '',
    url: '',
    source_id: '',
    status: '',
    created_at: '',
    RedirectConditions: null,
  };

  onExpandChange(id: number, checked: boolean): void {
    if (this.isTrialMode) {
      if (checked) {
        this.refs.controls[0]?.get('isUseConditions')?.reset();
        this.showUpgradePackageMessage();
      }
      return;
    }
    if (checked) {
      this.expandSet.add(id);
      if (this.redirectProfileModel[id].RedirectConditions.length == 0) {
        this.redirectProfileModel[id].RedirectConditions = [
          { ...this.initialRedirectCondition },
        ];
      }
      // this.redirectProfileModel['RedirectTypeID'] = 1;
    } else {
      this.expandSet.delete(id);
      // this.redirectProfileModel['RedirectTypeID'] = 2;
    }
    this.checkRefProbability(id);
  }
  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');
  profileOperatorList = [
    { value: '1', label: 'Và' },
    { value: '0', label: 'Hoặc' },
  ];
  redirectTypeList = [
    { value: '1', label: 'Quốc gia' },
    { value: '2', label: 'Mã IP' },
    // { value: '3', label: 'VPS' },
    { value: '3', label: 'VPN' },
    { value: '4', label: 'Chi phí' },
    { value: '5', label: 'Nhấp đôi chuột' },
    { value: '6', label: 'Thới gian' },
    // { value: '7', label: 'Clicks' },
  ];
  redirectOperatorList = [
    { value: '1', label: 'là' },
    { value: '0', label: 'không là' },
    { value: '3', label: 'chứa' },
    { value: '2', label: 'không chứa' },
    { value: '5', label: 'ở giữa' },
    { value: '4', label: 'không ở giữa' },
    { value: '6', label: 'lớn hơn' },
    { value: '7', label: 'nhỏ hơn' },
  ];
  selectableRedirectOperatorList: any[] = [...this.redirectOperatorList];
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private refService: RefService,
    private loadingService: LoadingService,
    private nnfb: NonNullableFormBuilder,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private nzContextMenuService: NzContextMenuService,
    private campaignService: CampaignService,
    protected override userService: UserService,
    private modal: NzModalService,
    private projectTypeService: ProjectTypeService
  ) {
    super(userService);
  }
  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.projectForm = this.fb.group({
      name: [null, [Validators.required]],
      active: [true, [Validators.required]],
      type_id: [true],
      // url: [null, [Validators.required]],
      // refs: [null],
      refs: this.fb.array([]),
    });
    this.addField();
    await this.getPageData();
  }
  get refs() {
    return this.projectForm.controls['refs'] as FormArray;
  }

  async getPageData() {
    this.loadingTable = true;
    await Promise.all([
      this.getRefData(),
      this.getProjectData(),
      this.getProjectType(),
      // this.getUserClickData(),
    ])
      // .then(([projectData, clickData]) => {
      .then(([refData, projectData]) => {
        // this.userClickData = clickData;
        this.listOfData = projectData?.data;
        this.listViewProject = [...this.listOfData];
        this.transformData();
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
        this.loadingTable = false;
        this.availableRefList = [...this.refList];
      });
  }

  reloadData() {
    this.getPageData();
  }

  // async getProjectData() {
  //   this.loadingTable = true;
  //   try {
  //     const res = await this.projectService.getProjectList().toPromise();
  //     this.listOfData = res!;
  //     // this.transformData();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     this.loadingTable = false;
  //   }
  // }
  async getProjectType() {
    try {
      await this.projectTypeService
        .getProjectTypeList()
        .toPromise()
        .then((res) => {
          let availableProjectTypeList = res?.data;
          if (this.userRole === Role.TrialUser) {
            availableProjectTypeList = availableProjectTypeList.filter(
              (item: any) => Number(item.id) === 1
            );
          }
          this.projectTypeList = availableProjectTypeList;
        });
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
  async getProjectData() {
    // this.loadingTable = true;
    let res;
    try {
      res = await this.projectService.getProjectList().toPromise();
      // this.listOfData = res!;
    } catch (error) {
      console.error(error);
    } finally {
      // this.loadingTable = false;
    }
    return res;
  }
  async getRefData() {
    this.loadingTable = true;
    try {
      const res = await this.refService.getRefList().toPromise();
      this.refList = res?.data;
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingTable = false;
    }
  }
  async getUserClickData() {
    const res = await this.dashboardService.getClickByUser().toPromise();
    // this.userClickData = res;
    return res;
  }
  betaMessage(event: any) {
    if (event && event?.length > 0)
      this.msg.info('Tính năng tìm kiếm hiện đang được phát triển!');
  }

  async openAddProjectModal(): Promise<void> {
    this.addProjectStep = 1;
    // if (this.refList.length === 0) {
    //   await this.getRefData();
    // }
    this.projectModalMode = ProjectModalMode.ADD;
    this.projectForm.reset();
    this.projectForm.get('active')?.setValue(true);
    this.isVisible = true;
    this.availableRefList = [...this.refList];
    this.addMoreRefRow();
  }
  async viewDetailProject(project?: Project): Promise<void> {
    this.addProjectStep = 2;
    this.projectModalMode = ProjectModalMode.VIEW;
    if (project) this.selectingProject = project;
    const currentProject = this.selectingProject;
    this.getAvailableRefList();
    let projectData: Project;
    this.loadingTable = true;
    this.projectForm.disable();
    await this.projectService
      .getProjectById(currentProject?.id)
      .toPromise()
      .then((res) => {
        if (checkResponseSuccess(res)) {
          projectData = res?.data;
          this.isVisible = true;
          this.projectForm.patchValue({
            name: projectData?.name,
            active: projectData?.status === '1' ? true : false,
            type_id: projectData?.type_id,
          });
          // Lấy danh sách tất cả refId
          let refIds: any[] = [];
          projectData?.RedirectProfiles?.forEach((item) => {
            if (!refIds.includes(item?.OfferID)) refIds.push(item?.OfferID);
          });
          // Add tất cả ref đó lên màn hình
          projectData?.RedirectProfiles?.forEach((redirectProfile, index) => {
            this.addMoreRefRow({
              refId: redirectProfile?.OfferID,
              refIdView: redirectProfile?.OfferID,
              refLink: redirectProfile?.url,
              probability: redirectProfile?.Probability,
              isUseConditions:
                redirectProfile?.RedirectConditions?.length > 0 ? true : false,
              active: redirectProfile?.Active === '1' ? true : false,
            });
            // Lưu các redirect profiles của từng ref vào model
            this.redirectProfileModel[index] = { ...redirectProfile };
            if (redirectProfile?.RedirectConditions?.length > 0) {
              this.onExpandChange(index, true);
            }
          });
          for (const key in this.refs.controls) {
            this.refs.controls[key].disable();
          }

          // Handle campaign data
          this.campaignList = projectData?.campaigns;
        }
      })
      .catch((error) => {
        handleCatchException(error);
        console.error(error);
      })
      .finally(() => {
        this.loadingTable = false;
      });
    // project?.
  }

  // async addNewProject() {
  //   this.checkValidProjectForm();
  //   if (this.projectForm.valid) {
  //     this.loadingService.setLoading(true);
  //     try {
  //       let refs: any[] = [];
  //       for (const key in this.refForm.controls) {
  //         const refId = this.refForm.controls[key]?.value;
  //         refs.push(parseInt(refId));
  //       }
  //       const projectData = {
  //         name: this.projectForm.get('name')?.value,
  //         refs,
  //       };
  //       const res = await this.projectService
  //         .addNewProject(projectData)
  //         .toPromise();
  //       if (res?.code === 200) {
  //         this.msg.success('Create project successfully!');
  //         this.isVisible = false;
  //       } else {
  //         this.msg.error('Something went wrong, cannot create project!');
  //       }
  //     } catch (error) {
  //       handleCatchException(
  //         error,
  //         this.msg,
  //         'Something went wrong, cannot create project!'
  //       );
  //       console.error(error);
  //     } finally {
  //       this.loadingService.setLoading(false);
  //       await this.getPageData();
  //     }
  //   }
  // }
  async addNewProject() {
    this.checkValidProjectForm();
    if (this.projectForm.valid) {
      let redirectProfiles = [];
      for (const i in this.refs.controls) {
        const ref = { ...this.refs.controls[i]?.getRawValue() };
        let redirectConditions: any[] = [];
        for (const j in this.redirectProfileModel[i]?.RedirectConditions) {
          const condition = this.redirectProfileModel[i]?.RedirectConditions[j];
          redirectConditions.push({
            OrderIndex: j + 1,
            RedirectTypeID: condition?.RedirectTypeID,
            RedirectOperatorID: condition?.RedirectOperatorID,
            ValueCondition: condition?.ValueCondition,
          });
        }
        const refPayload = {
          RedirectProfileName:
            this.projectForm.get('name')?.value + "'s redirect profile",
          ProfileOperator:
            this.redirectProfileModel[i]?.ProfileOperator !== ''
              ? this.redirectProfileModel[i]?.ProfileOperator
              : '',
          OfferID: ref?.refId,
          Active: ref?.active === true ? '1' : '0',
          RedirectTypeID: ref?.isUseConditions ? '1' : '2',
          Probability: ref?.probability !== '' ? Number(ref?.probability) : 0,
          RedirectConditions: ref?.isUseConditions ? redirectConditions : [],
        };
        redirectProfiles.push(refPayload);
      }
      let totalProbability = 0;
      let noConditionsRefAmount = 0;
      redirectProfiles.forEach((item) => {
        if (item.RedirectTypeID == '2') {
          totalProbability = totalProbability + item.Probability;
          noConditionsRefAmount++;
        }
      });
      if (noConditionsRefAmount === 0) {
        this.msg.error('Phải có ít nhất 1 link ref không kèm điều kiện!');
        return;
      }
      for (let profile of redirectProfiles) {
        if (profile.RedirectConditions.length > 0) {
          for (let condition of profile.RedirectConditions) {
            if (
              condition.RedirectTypeID === null ||
              condition.RedirectOperatorID === null ||
              condition.ValueCondition === null ||
              profile.ProfileOperator === ''
            ) {
              this.isShowConditionErrorTip = true;
              return; // Exit early if any condition fails
            }
          }
        }
      }
      this.isShowConditionErrorTip = false; // Reset if no condition fails
      if (totalProbability !== 100) {
        this.modal.error({
          nzTitle: 'Tổng xác suất phải là 100%!',
          nzContent: `Tổng xác suất hiện tại là ${totalProbability}%. Vui lòng điều chỉnh sao cho tổng xác suất bằng 100%`,
          nzCancelText: 'Tự động phân bổ link ref',
          nzOkText: 'Chỉnh sửa thủ công',
          nzOnCancel: () => {
            this.autoAllocateRefPercent();
          },
        });
        return;
      }
      this.loadingService.setLoading(true);
      try {
        // redirectProfiles.forEach((item) => {
        //   item.Probability = item.Probability.toString();
        // });
        const projectData = {
          name: this.projectForm.get('name')?.value,
          type_id: this.projectForm.get('type_id')?.value,
          status: this.projectForm.get('active')?.value === true ? '1' : '0',
          RedirectProfiles: redirectProfiles,
        };
        let res: any;
        if (this.projectModalMode === ProjectModalMode.ADD) {
          res = await this.projectService
            .addNewProject(projectData)
            .toPromise();
        } else if (this.projectModalMode === ProjectModalMode.EDIT) {
          const editProjectPayload = {
            ...projectData,
            id: this.selectingProject?.id,
          };
          res = await this.projectService
            .updateProject(editProjectPayload)
            .toPromise();
        }
        if (res?.code === 200) {
          this.msg.success('Tạo dự án thành công!');
          this.isVisible = false;
          this.resetAllProjectForm();
        } else {
          this.msg.error('Đã xảy ra lỗi, không thể tạo dự án!');
        }
      } catch (error) {
        handleCatchException(
          error,
          this.msg,
          'Đã xảy ra lỗi, không thể tạo dự án!'
        );
        console.error(error);
      } finally {
        this.loadingService.setLoading(false);
        await this.getPageData();
      }
    }
  }

  async handleAddProject(): Promise<void> {
    if (this.projectModalMode === ProjectModalMode.ADD) {
      await this.addNewProject();
    } else if (this.projectModalMode === ProjectModalMode.VIEW) {
      this.getAvailableRefList();
      this.projectModalMode = ProjectModalMode.EDIT;
      this.projectForm.enable();
      this.handleDisableField();
      for (const i in this.refs.controls) {
        this.checkRefProbability(i);
      }
    } else if (this.projectModalMode === ProjectModalMode.EDIT) {
      await this.addNewProject();
    }
  }
  handleDisableField() {
    for (const key in this.refs.controls) {
      this.refs.controls[key]?.get('refIdView')?.disable();
      this.refs.controls[key]?.get('refLink')?.disable();
    }
  }

  handleCancel(): void {
    if (this.projectModalMode === ProjectModalMode.EDIT) {
      this.projectForm.disable();
      this.projectModalMode = ProjectModalMode.VIEW;
    } else {
      this.closeModal();
    }
  }
  closeModal(): void {
    this.isVisible = false;
    this.resetAllProjectForm();
  }
  resetAllProjectForm(): void {
    this.clearAllRefsForm();
    this.projectForm.enable();
    this.expandSet.clear();
    this.redirectProfileModel = {};
  }
  refForm: FormRecord<FormControl<any>> = this.nnfb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  addField(e?: MouseEvent): void {
    if (this.listOfControl.length > 0) return;
    e?.preventDefault();
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `ref_${id}`,
    };
    const index = this.listOfControl.push(control);
    this.refForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.nnfb.control(null, Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.refForm.removeControl(i.controlInstance);
    }
    this.getAvailableRefList();
  }

  onSelectRef(e: any, refFormIndex: number) {
    const ref = this.availableRefList.find((item) => item.id.toString() === e);
    this.refs.controls[refFormIndex].get('refLink')?.setValue(ref?.url);
    this.refs.controls[refFormIndex].get('refIdView')?.setValue(ref?.id);
    this.getAvailableRefList();
    this.changeRedirectProfileModel(refFormIndex);
  }

  // getAvailableRefList() {
  //   this.availableRefList = [...this.refList];
  //   for (const key in this.refForm.controls) {
  //     const refId = this.refForm.controls[key]?.value;
  //     // Tìm vị trí của mục có id là 32 trong mảng availableRefList
  //     const index = this.availableRefList.findIndex(
  //       (item) => item.id.toString() === refId
  //     );
  //     // Nếu tìm thấy mục có id là 32, loại bỏ nó khỏi mảng
  //     if (index !== -1) {
  //       this.availableRefList.splice(index, 1);
  //     }
  //   }
  // }
  getAvailableRefList() {
    this.availableRefList = [...this.refList];
    for (const key in this.refs.controls) {
      const refId = this.refs.controls[key]?.value?.refId;
      // Tìm vị trí của mục có id là 32 trong mảng availableRefList
      const index = this.availableRefList.findIndex(
        (item) => item.id.toString() === refId
      );
      // Nếu tìm thấy mục có id là 32, loại bỏ nó khỏi mảng
      if (index !== -1) {
        this.availableRefList.splice(index, 1);
      }
    }
  }
  checkValidProjectForm() {
    // Nếu type là bọc link thì mới check điều kiện của form refs
    for (const i in this.refs.controls) {
      this.checkValidForm(this.refs.controls[i]);
    }

    this.checkValidForm(this.projectForm);
  }
  checkValidForm(formGroup: any) {
    for (const i in formGroup.controls) {
      const formControl = formGroup.controls[i] as any;
      formControl.markAsDirty();
      formControl.updateValueAndValidity();
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
  transformData() {
    this.listOfData?.forEach((c) => {
      c.link_tracking = `https://authoritysitemaster.com/tracking?asmid=${this.userInfo.uuid}&asmcp=${c.id}&source_id={network}&creative_id={creative}&project_id={projectid}&project=${c.name}&creative_set_id={adgroupid}&placement_id={placement}&keyword={keyword}&feeditemid={feeditemid}&targetid={targetid}&loc_interest_ms={loc_interest_ms}&loc_physical_ms={loc_physical_ms}&matchtype={matchtype}&device={device}&devicemodel={devicemodel}&target={target}&desturl={lpurl}`;
      // c.link_tracking = `https://asmteam.click/asmdev/track?asmid=${this.userInfo.uuid}&source_id=g&creative_id=694478357880&project_id=21123712685&project=${c.id}&creative_set_id=166986909984&placement_id=&keyword=mightynetworks&feeditemid=&targetid=kwd-16588858602`;
      c.number_of_clicks = this.userClickData?.clicks?.filter(
        (cl: any) =>
          cl.uri.includes(`asmid=${this.userInfo.uuid}`) &&
          (cl.uri.includes(`project=${c.name}`) ||
            cl.uri.includes(`asmcp=${c.id}`))
      )?.length;
    });
  }
  onClickProject(project: any) {
    let projectClickData = this.userClickData?.clicks?.filter(
      (cl: any) =>
        cl.uri.includes(`asmid=${this.userInfo.uuid}`) &&
        (cl.uri.includes(`project=${project.name}`) ||
          cl.uri.includes(`asmcp=${project.id}`))
    );
    // this.projectClickStatisticsModal.showModal(project, projectClickData);
  }

  contextMenu(
    $event: MouseEvent,
    menu: NzDropdownMenuComponent,
    project: Project
  ): void {
    this.selectingProject = project;
    this.nzContextMenuService.create($event, menu);
  }
  async viewCampaignList(project?: Project) {
    this.loadingService.setLoading(true);
    await this.appCampaignListModal.showModal(project ?? this.selectingProject);
    this.loadingService.setLoading(false);
  }
  addMoreRefRow(data?: any) {
    if (this.isTrialMode && this.refs.length > 0) {
      this.showUpgradePackageMessage();
      return;
    }
    this.refs.push(this.createItem(data));
  }
  createItem(data?: any): FormGroup {
    let newFg = this.fb.group({
      refId: [data ? data.refId : null, [Validators.required]],
      refIdView: [data ? data.refIdView : null],
      refLink: [data ? data.refLink : null],
      probability: [data ? data.probability : this.isTrialMode ? 100 : 0], // Nếu đang là trial mode thì mặc định là 100 luôn vì user sẽ không sửa được trường này
      isUseConditions: [data ? data.isUseConditions : false],
      active: [data ? data.active : true],
    });
    newFg.get('refIdView')?.disable();
    newFg.get('refLink')?.disable();
    return newFg;
  }
  onClickDeleteRowRefsForm(i: any) {
    this.refs.removeAt(i);
  }
  clearAllRefsForm() {
    this.refs.clear();
  }
  onClickDeleteRowRedirectConditions(refIndex: any, conditionIndex: any) {
    this.redirectProfileModel[refIndex].RedirectConditions.splice(
      conditionIndex,
      1
    );
    if (this.redirectProfileModel[refIndex].RedirectConditions.length === 0) {
      this.onExpandChange(refIndex, false);
      this.refs.controls[refIndex].get('isUseConditions')?.setValue(false);
    }
  }
  changeRedirectProfileModel(refIndex: any) {
    if (!this.redirectProfileModel[refIndex]) {
      this.redirectProfileModel[refIndex] = {
        ...this.initialRedirectProfileModel,
      };
      this.redirectProfileModel[refIndex].RedirectConditions = [
        { ...this.initialRedirectCondition },
      ];
    }
  }
  addMoreConditionRow(refIndex: any) {
    this.redirectProfileModel[refIndex].RedirectConditions.push({
      ...this.initialRedirectCondition,
    });
  }
  onChangeRefActive(refIndex: any, e: any) {
    this.checkRefProbability(refIndex);
  }

  disableRefProbability(refIndex: any) {
    this.refs.controls[refIndex].get('probability')?.setValue(0);
    this.refs.controls[refIndex].get('probability')?.disable();
  }
  checkRefProbability(refIndex: any) {
    if (
      this.refs.controls[refIndex].get('active')?.value === false ||
      this.refs.controls[refIndex].get('isUseConditions')?.value === true
    ) {
      this.disableRefProbability(refIndex);
    } else {
      this.refs.controls[refIndex].get('probability')?.enable();
    }
  }

  onChangeProfileOperator(refIndex: number, e: any) {
    this.redirectProfileModel[refIndex].ProfileOperator = e;
  }
  autoAllocateRefPercent() {
    // Khởi tạo allocateAmount để đếm các phần tử thỏa mãn điều kiện
    let allocateAmount = 0;

    // Đếm các phần tử có thuộc tính refs.controls[key]?.getRawValue()?.isUseConditions == false
    for (const key in this.refs.controls) {
      const controlValue = this.refs.controls[key]?.getRawValue();
      if (
        controlValue?.isUseConditions === false &&
        controlValue?.active === true
      ) {
        allocateAmount++;
      }
    }

    if (allocateAmount > 0) {
      // Tính amount của mỗi ref bằng công thức 100/allocate rồi làm tròn
      const amountPerRef = Math.floor(100 / allocateAmount);
      let sum = 0;
      let count = 0;

      // Gán giá trị này vào thuộc tính probability cho các ref thỏa mãn điều kiện
      for (const key in this.refs.controls) {
        const controlValue = this.refs.controls[key]?.getRawValue();
        if (
          controlValue?.isUseConditions === false &&
          controlValue?.active === true
        ) {
          if (count < allocateAmount - 1) {
            this.refs.controls[key].get('probability')?.setValue(amountPerRef);
            sum += amountPerRef;
          } else {
            // Giá trị cuối cùng = 100 - tổng các giá trị trước đó
            this.refs.controls[key].get('probability')?.setValue(100 - sum);
          }
          count++;
        }
      }
    }
  }
  getNzOkText() {
    return this.projectModalMode === ProjectModalMode.VIEW
      ? 'Chỉnh sửa dự án'
      : this.projectModalMode === ProjectModalMode.EDIT
      ? 'Lưu dự án'
      : 'Thêm dự án';
  }
  onChangeRedirectType(e: any) {
    switch (e) {
      case '1': // Country
      case '2': // IP
      case '3': // VPS
        this.selectableRedirectOperatorList = this.redirectOperatorList.filter(
          (operator) => ['0', '1', '2', '3'].includes(operator.value)
        );
        break;
      case '4': // Cost
        this.selectableRedirectOperatorList = this.redirectOperatorList.filter(
          (operator) => ['2', '1', '4', '5', '6', '7'].includes(operator.value)
        );
        break;
      case '5': // Duplicate Click
        this.selectableRedirectOperatorList = this.redirectOperatorList.filter(
          (operator) => ['0', '1', '4', '5', '6', '7'].includes(operator.value)
        );
        break;
      case '6': // Time
        this.selectableRedirectOperatorList = this.redirectOperatorList.filter(
          (operator) => ['4', '5', '6', '7'].includes(operator.value)
        );
        break;
      case '7': // Clicks
        this.selectableRedirectOperatorList = this.redirectOperatorList.filter(
          (operator) => ['0', '1', '4', '5', '6', '7'].includes(operator.value)
        );
        break;
      default:
        this.selectableRedirectOperatorList = [];
    }
  }
  onSearchProject(e: any) {
    this.listViewProject = this.listOfData.filter(
      (project) =>
        project.name.toLowerCase().includes(e.toLowerCase()) ||
        project.id.toLowerCase().includes(e.toLowerCase())
    );
  }

  // Campaign
  adsCampaignIdInput: string = '';
  adsCampaignNameInput: string = '';
  adsCampaignNameInputStatus: NzStatus = '';
  adsCampaignIdInputStatus: NzStatus = '';
  isAddingCampaign: boolean = false;
  isLoadingSaveCampaignButton: boolean = false;
  campaignList: Campaign[] = [];
  onClickAddCampaign() {
    this.isAddingCampaign = true;
  }
  onCancelAddCampaign() {
    this.isAddingCampaign = false;
  }
  async onSaveCampaign() {
    // Hiện khoanh đỏ những ô cần nhập mà chưa được nhập
    if (this.adsCampaignNameInput === '' || this.adsCampaignIdInput === '') {
      this.msg.error('Vui lòng nhập tên và mã chiến dịch');
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
        project_id: this.selectingProject?.id,
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
        this.msg.success('Lưu chiến dịch thành công!');
        this.adsCampaignNameInputStatus = '';
        this.adsCampaignIdInputStatus = '';
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoadingSaveCampaignButton = false;
    }
  }
  async getCampaignList() {
    try {
      this.loadingService.setLoading(true);
      this.projectService
        .getProjectById(this.selectingProject?.id)
        .toPromise()
        .then((res) => {
          if (checkResponseSuccess(res)) {
            this.campaignList = res?.data?.campaigns;
          }
        });
    } catch (e) {
    } finally {
      this.loadingService.setLoading(false);
    }
    // try {
    //   const res = await this.campaignService
    //     .getCampaignListByProjectId(this.selectingProject?.id)
    //     .toPromise();
    //   if (res.code === 200) {
    //     this.campaignList = res?.data;
    //   } else {
    //     this.msg.error('Can not get campaign list');
    //   }
    // } catch (e) {
    //   this.msg.error('Something went wrong. Please try again');
    //   console.log(e);
    // } finally {
    //   this.loadingService.setLoading(false);
    // }
  }
  async editProject() {
    await this.viewDetailProject();
    setTimeout(async () => {
      await this.handleAddProject();
    }, 300);
  }

  onClickProjectType(projectTypeId: any) {
    if (projectTypeId === '2' && this.userRole === Role.TrialUser) {
      this.showUpgradePackageMessage();
      return;
    }
    this.projectForm.get('type_id')?.setValue(projectTypeId);
    this.addProjectStep = 2;
  }
  showUpgradePackageMessage() {
    this.msg.error(
      'Bạn cần nâng cấp lên các gói dịch vụ của ASMLink để sử dụng tính năng này!'
    );
  }
}
