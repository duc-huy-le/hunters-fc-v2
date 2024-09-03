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
import { RefService } from '../../../services/ref/ref.service';
import { map } from 'rxjs';
import { BaseComponent } from '../../common/base/base.component';
import { LoadingService } from '../../../services/common/loading.service';
import { Ref } from '../../../models/Ref';
import {
  checkResponseSuccess,
  handleCatchException,
} from '../../../utils/Uitls';
import { checkValidForm } from '../../../helpers/Helpers';

@Component({
  selector: 'app-ref',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ref.component.html',
  styleUrl: './ref.component.css',
})
export class RefComponent {
  refForm!: FormGroup;
  listOfTagOptions: string[] = [];
  listOfOption: string[] = [];
  listOfData: Ref[] = [];
  listViewRef: Ref[] = [];
  searchRefValue!: string;
  loadingTable: boolean = false;
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private refService: RefService,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.refForm = this.fb.group({
      name: [null, [Validators.required]],
      url: [null, [Validators.required]],
    });
    this.getRefData();
  }
  async getRefData() {
    this.loadingTable = true;
    try {
      const res = await this.refService.getRefList().toPromise();
      this.listOfData = res?.data;
      this.listViewRef = [...this.listOfData];
    } catch (error) {
      handleCatchException(
        error,
        this.msg,
        'Đã xảy ra lỗi, không thể tạo ref!'
      );
      console.error(error);
    } finally {
      this.loadingTable = false;
    }
  }
  reloadData() {
    this.getRefData();
  }
  async addNewRef() {
    checkValidForm(this.refForm);
    if (this.refForm.invalid) return;
    this.loadingService.setLoading(true);
    if (this.refForm.valid) {
      try {
        const res = await this.refService
          .addNewRef(this.refForm.value)
          .toPromise();
        if (res?.code === 200) {
          this.msg.success('Tạo ref thành công!');
          this.isVisible = false;
        } else {
          this.msg.error('Đã xảy ra lỗi, không thể tạo ref!');
        }
        await this.getRefData();
      } catch (error) {
        handleCatchException(
          error,
          this.msg,
          'Đã xảy ra lỗi, không thể tạo ref!'
        );
        console.error(error);
      } finally {
        this.loadingService.setLoading(false);
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

  async handleAddRef(): Promise<void> {
    await this.addNewRef();
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

  onSearchRef(e: any) {
    this.listViewRef = this.listOfData.filter(
      (ref) =>
        ref.name.toLowerCase().includes(e.toLowerCase()) ||
        ref.url.toLowerCase().includes(e.toLowerCase()) ||
        ref.id.toLowerCase().includes(e.toLowerCase())
    );
  }
}
