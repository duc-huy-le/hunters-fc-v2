import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-post-modal',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, FormsModule],
  templateUrl: './detail-post-modal.component.html',
  styleUrl: './detail-post-modal.component.css'
})
export class DetailPostModalComponent {
  post = {
    summary: 'This is the summary of the post',
    postId: 'post123',
    user: {
      userId: 'user001',
      name: 'John Doe',
      profilePicture: 'https://example.com/images/johndoe.jpg'
    },
    content: 'This is the full version of the post content. It might include images, links, etc',
    createdAt: new Date('2024-08-14T10:00:00Z'),
    likeCount: 25,
    userLiked: true,
    media: [
      {
        type: 'image',
        url: 'https://example.com/images/post123_image1.jpg',
        caption: 'A beautiful sunrise',
        thumbnail: 'https://example.com/images/post123_image1_thumb.jpg'
      },
      {
        type: 'video',
        url: 'https://example.com/videos/post123_video.mp4',
        thumbnail: 'https://example.com/images/post123_video_thumb.jpg',
        caption: 'Watch this amazing video'
      }
    ],
    comments: [
      {
        commentId: 'comment456',
        user: {
          userId: 'user003',
          name: 'Alice Brown',
          profilePicture: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/416137715_6421688664599481_8826627216426784313_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8U6i85PUzJsQ7kNvgGKA4IE&_nc_ht=scontent.fhan2-5.fna&oh=00_AYC9UJO0afNtEYRg8YvZviI29eejFUT6-y0WnF5aikvVIQ&oe=66D92869'
        },
        content: 'This is a preview of a comment.',
        createdAt: new Date('2024-08-14T12:00:00Z')
      },
      {
        commentId: 'comment457',
        user: {
          userId: 'user004',
          name: 'Bob White',
          profilePicture: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/416137715_6421688664599481_8826627216426784313_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8U6i85PUzJsQ7kNvgGKA4IE&_nc_ht=scontent.fhan2-5.fna&oh=00_AYC9UJO0afNtEYRg8YvZviI29eejFUT6-y0WnF5aikvVIQ&oe=66D92869'
        },
        content: 'Another comment preview.',
        createdAt: new Date('2024-08-14T12:05:00Z')
      }
    ],
    commentCount: 101
  };
  userInfo = {
    id: 12,
    name: 'Salad Lê',
    avatar: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.6435-1/160013385_2788161514771671_3440062089844716657_n.jpg?stp=c1.78.198.199a_dst-jpg_p200x200&_nc_cat=104&ccb=1-7&_nc_sid=e4545e&_nc_ohc=LQFzc6i8_cAQ7kNvgF9ampc&_nc_ht=scontent.fhan2-5.fna&oh=00_AYACCIrGjkCTHh6rQsEDKa8AoCRB9MobdBph3UDjCMsUtw&oe=66FAC722'
  }
  isVisible: boolean = false;
  editingComment: string = "";
  editingCommentId: any = null;
  newComment: string = '';
  openModal(postId: any): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
  }
  handleAddComment(): void {
    const payload = {
      postId: this.post.postId,
      userId: this.userInfo.id,
      parentId: null,
      summary: "",
      content: this.newComment
    }
    //TODO: call API
    this.newComment = '';
  }
  onClickEditComment(comment: any): void {

    this.editingComment = comment?.content;
    this.editingCommentId = comment?.commentId;
  }
  onClickCancelComment(): void {
    this.editingComment = '';
    this.editingCommentId = null;
  }
  handleEditComment() {
    const payload = {
      summary: "",
      content: this.editingComment
    }
    //TODO: call API

    this.editingComment = '';
    this.editingCommentId = null;
  }
}
