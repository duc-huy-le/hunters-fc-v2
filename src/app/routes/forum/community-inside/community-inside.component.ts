import { Component, ViewChild } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CreatePostModalComponent } from '../../../components/modals/create-post-modal/create-post-modal.component';
import { CommonModule } from '@angular/common';
import { DetailPostModalComponent } from '../../../components/modals/detail-post-modal/detail-post-modal.component';

@Component({
  selector: 'app-community-inside',
  standalone: true,
  imports: [NgZorroAntdModule, CreatePostModalComponent, CommonModule, DetailPostModalComponent],
  templateUrl: './community-inside.component.html',
  styleUrl: './community-inside.component.css'
})
export class CommunityInsideComponent {
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
  postList: any[] = [
    {
      postId: 'post123',
      user: {
        userId: 'user001',
        name: 'Long Lê',
        profilePicture: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/416137715_6421688664599481_8826627216426784313_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8U6i85PUzJsQ7kNvgGKA4IE&_nc_ht=scontent.fhan2-5.fna&oh=00_AYC9UJO0afNtEYRg8YvZviI29eejFUT6-y0WnF5aikvVIQ&oe=66D92869'
      },
      content: 'Feel free to use the curriculum how you please. Here is my suggestion below on how to get the ...',
      summary: '🥷 How To Use The Curriculum & Improve Your Skill ☯️',
      truncated: true,
      createdAt: '2024-08-14T10:00:00Z',
      likeCount: 25,
      commentCount: 10,
      userLiked: true,
      mediaSummary: [
        {
          type: 'image',
          thumbnail: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t1.18169-9/16387187_1381908655195351_3843761587723721580_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=Ax50EFX3VmYQ7kNvgF-47SI&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD9VpeROaxKZEweRUJRb-N6ddTKEXTp1umhwtnnJE72ig&oe=66F23284'
        },
        {
          type: 'video',
          thumbnail: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t1.18169-9/16387187_1381908655195351_3843761587723721580_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=Ax50EFX3VmYQ7kNvgF-47SI&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD9VpeROaxKZEweRUJRb-N6ddTKEXTp1umhwtnnJE72ig&oe=66F23284'
        }
      ]
    },
    {
      postId: 'post124',
      user: {
        userId: 'user002',
        name: 'Jane Doe',
        profilePicture: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t1.18169-9/16387187_1381908655195351_3843761587723721580_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=Ax50EFX3VmYQ7kNvgF-47SI&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD9VpeROaxKZEweRUJRb-N6ddTKEXTp1umhwtnnJE72ig&oe=66F23284'
      },
      content: 'Dude...I fucking love Sifu man 😂 I was raised in a vulgar, brazen, direct household and grew up around too ...',
      summary: 'Down to Earth Sifu',
      truncated: false,
      createdAt: '2024-08-13T12:00:00Z',
      likeCount: 50,
      commentCount: 20,
      userLiked: false,
      mediaSummary: [
        {
          type: 'video',
          thumbnail: 'https://example.com/images/post124_video_thumb.jpg'
        }
      ]
    },
    {
      postId: 'post125',
      user: {
        userId: 12,
        name: 'Bob Smith',
        profilePicture: 'https://example.com/images/bobsmith.jpg'
      },
      content: 'This is a post with no media...',
      summary: 'Down to Earth Sifu 2',
      truncated: false,
      createdAt: '2024-08-12T14:00:00Z',
      likeCount: 0,
      commentCount: 0,
      userLiked: false,
      mediaSummary: []
    }
  ];
  @ViewChild('createPostModal') createPostModal!: CreatePostModalComponent;
  @ViewChild('detailPostModal') detailPostModal!: DetailPostModalComponent;
  isShowCreatePostModal: boolean = false;
  userInfo = {
    id: 12,
    name: 'Salad Lê',
  }
  openCreatePostModal(post?: any): void {
    this.createPostModal.openModal(post);
  }
  openDetailPost(post?: any): void {
    this.detailPostModal.openModal(post?.postId);
  }
}
