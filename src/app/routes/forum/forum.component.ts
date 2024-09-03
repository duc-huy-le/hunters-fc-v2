import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgZorroAntdModule, RouterModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent {
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

  constructor(private authService: AuthService) { }
  logout(): void {
    this.authService.logout();
  }
}
