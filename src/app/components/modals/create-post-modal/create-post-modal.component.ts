import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, FormsModule],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.css'
})
export class CreatePostModalComponent {
  userInfo = {
    id: 12,
    name: 'Salad Lê',
  }
  community = {
    groupId: '123',
    name: 'GYMer daily',
    description: 'This is a brief description of the group.',
    privacy: 'public',
    ownerId: 'uuid-of-the-owner-user',
    category: 'Category Name',
    media: [
      {
        type: 'image',
        url: 'http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcThuC9-Coq5aeFzOysHOM4QqNN0CMV4e94E90NXxoVioFjt9Zt299Pj4172IfzfkB9BoHsrrwOVS20KILjIhb0',
        caption: 'Group banner image'
      }
    ],
    createdAt: '2024-08-15T12:00:00Z',
    updatedAt: '2024-08-15T12:00:00Z'
  };
  isVisible: boolean = false;
  title: string = '';
  content: string = '';
  publicPrivacy: boolean = true;
  mode: string = 'create';
  constructor(private msg: NzMessageService) { }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
      // Thực hiện các thao tác khác với file ở đây
    }
  }
  openModal(post: any): void {
    this.isVisible = true;
    if (post) {
      this.mode = 'edit';
      this.title = post.summary;
      this.content = post.content;
      this.publicPrivacy = post.privacy === 'public';      
    }
  }
  closeModal(): void {
    this.mode = 'create';
    this.title = '';
    this.content = '';
    this.isVisible = false;
  }
  handleAddPost(): void {
    const payload = {
      userId: this.userInfo.id,
      groupId: this.community.groupId,
      summary: this.title,
      // privacy: this.publicPrivacy ? 'public' : 'private',
      content: this.content,
      media: Array.from(document.querySelectorAll<HTMLInputElement>('#fileInput')).map(input => {
        return {
          // type: input.dataset.type,
          url: input.value,
          caption: (input.nextElementSibling as HTMLInputElement).value
        };
      })
    };
    console.log(payload);
    this.closeModal();
  }
}
