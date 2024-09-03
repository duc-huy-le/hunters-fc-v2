import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { Router } from '@angular/router';
import { checkValidForm } from '../../../helpers/Helpers';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-create-community',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  templateUrl: './create-community.component.html',
  styleUrl: './create-community.component.css'
})
export class CreateCommunityComponent {
  communityName: string = ''; // Tên của cộng đồng
  communityDescription: string = ''; // Mô tả của cộng đồng
  commnunityPrivacy: string = 'public';
  communityCategory: string[] = []; // Linh vực của cộng đồng
  communityCategoryOptions: any[] = []; // Dnah sách các lĩnh vực để chọn
  createCommunityStep: number = 1; // Bước hiện tại trong quá trình tạo cộng đồng
  createCommunityForm!: FormGroup;
  constructor(private router: Router,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) { }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.createCommunityForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      category: [null],
      privacy: [null],
    })
  }
  // Chuyển sang bước tạo step khác
  changeStep(step: number) {
    if (step === 2) {
      checkValidForm(this.createCommunityForm);
      if (this.createCommunityForm.get('name')?.invalid) return;
    }
    this.createCommunityStep = step;
  }

  createGroup() {
    // TODO: call api here
    this.router.navigate(['forum/community/123']);
  }

  // Code upload file
  loading = false;
  iconUrl?: string;
  bannerUrl?: string;
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }, type: string): void {
    console.log('File upload status:', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        console.log('Upload successful, server response:', info.file.response);
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          if (type === 'icon') {
            this.iconUrl = img;
          } else if (type === 'banner') {
            this.bannerUrl = img;
          }
        });
        break;
      case 'error':
        console.error('Upload failed, server response:', info.file.response);
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

}
