import { TutorialProgress } from './../../../interfaces/TutorialProgress';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TUTORIAL_PROGRESS } from '../../../constants/constants';
import { UserService } from '../../../shared/user/user.service';
import { User } from '../../../models/User';
import { Role } from '../../../shared/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom, skip } from 'rxjs';
export interface Lesson {
  name: string;
  isActive: boolean;
  isDisabled: boolean;
  driverLink?: string;
  videoPath?: string;
}
@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  tutorialProgress!: TutorialProgress;
  currentChapterTabIndex: number = 0;
  acceptRole: Role[] = [
    Role.Admin,
    Role.ProUser,
    Role.UnlimitedUser,
    Role.TrialUser,
  ];
  isCanAccessChapterTwo: boolean = true;
  userInfo!: User;
  chapterOneList: Lesson[] = [
    {
      name: 'Chia sẻ trước khóa học',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output.m3u8',
      // videoPath: 'https://stream3.unica.vn/edubit/3481/348067/1080p.m3u8',
    },
    {
      name: 'Những mảng kinh doanh hiện tại của ASM',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output2.m3u8',
    },
    {
      name: 'Quy tắc và tôn chỉ lớp học',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output3.m3u8',
    },
    {
      name: 'Mục tiêu của khóa học',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output4.m3u8',
    },
    {
      name: '3 nỗi đau khi chạy ads và lý do gốc rễ',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output5.m3u8',
    },
    {
      name: 'Hiểu về chính sách của các dự án',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output6.m3u8',
    },
    {
      name: 'Các kiểu bắt ads của dự án',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output7.m3u8',
    },
    {
      name: 'Cạm bẫy của các dự án',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output8.m3u8',
    },
    {
      name: 'Giải pháp bọc link ASMLink',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output9.m3u8',
    },
    {
      name: 'Các tính năng đang phát triển',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output10.m3u8',
    },
    {
      name: '“Bảo hiểm” cho tài khoản affiliate',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output11.m3u8',
    },
    {
      name: 'Gợi ý các chiến lược lên ads',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output12.m3u8',
    },
    {
      name: 'Tài nguyên cần chuẩn bị và tổng quan cách sử dụng hệ thống bọc link',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output13.m3u8',
    },
    {
      name: 'Tip chứng minh traffic hiệu quả',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output14.m3u8',
    },
    {
      name: 'Chia sẻ từ các anh chị em học viên',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/output15.m3u8',
    },
  ];
  chapterTwoList: Lesson[] = [
    {
      name: 'Đăng ký tài khoản & đăng nhập',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_1.m3u8',
    },
    {
      name: 'Tạo link ref',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_2.m3u8',
    },
    {
      name: 'Tạo dự án',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_3.m3u8',
    },
    {
      name: 'Tạo chiến dịch',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_4.m3u8',
    },
    {
      name: 'Chạy script trong chiến dịch quảng cảo',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_5.m3u8',
    },
    {
      name: 'Cài đặt tần suất chạy script "HÀNG GIỜ"',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_6.m3u8',
    },
    {
      name: 'Xem dữ liệu thống kê',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_7.m3u8',
    },
    {
      name: 'Giới thiệu chức năng mới - Redirect',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/chapter2/output2_8.m3u8',
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private msg: NzMessageService
  ) { }
  async ngOnInit() {
    // Lấy thông tin user
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userInfo = data;
      const userRole = Number(this.userInfo?.role);
      if (data && userRole !== Role.AffiliateUser) {
        this.isCanAccessChapterTwo = true;
      } else {
        this.isCanAccessChapterTwo = false;
        if (data && this.currentChapterTabIndex !== 0) {
          this.msg.warning(
            'To unlock more advanced features, consider topping up to our premium plan.'
          );
          this.onChangeChapterTabIndex(0);
        }
      }
    });
    // this.userInfo = await firstValueFrom(
    //   this.userService.subscribeUserInfo().pipe(skip(1))
    // );
    // const userRole = Number(this.userInfo?.role);
    // if (this.userInfo && userRole !== Role.TrialUser) {
    //   this.isCanAccessChapterTwo = true;
    // } else {
    //   this.isCanAccessChapterTwo = false;
    // }
    // Lấy trạng thái học khóa học hiện tại
    this.tutorialProgress = JSON.parse(
      localStorage.getItem(TUTORIAL_PROGRESS) || '{}'
    );
    // Bắt hành động khi thay đổi query param
    this.route.queryParams.subscribe((params) => {
      const chapter = params['chapter'];
      if (chapter) this.currentChapterTabIndex = chapter - 1;
      else this.onChangeChapterTabIndex(0);
    });
  }

  onChangeChapterTabIndex(e: any) {
    const queryParams = { ...this.route.snapshot.queryParams };
    this.currentChapterTabIndex = e;
    if (e === 0) {
      queryParams['chapter'] = '1'; // Add ?chapter=1
      // location.href = '/home/tutorial?chapter=1';
    } else if (e === 1) {
      queryParams['chapter'] = '2'; // Add ?chapter=2
      // location.href = '/home/tutorial?chapter=2';
    }
    if (e === 1 && !this.isCanAccessChapterTwo) {
      this.msg.warning(
        'To unlock more advanced features, consider topping up to our premium plan.'
      );
      return;
    }
    this.router
      .navigate(['home/tutorial'], { queryParams: queryParams })
      .then(() => {
        window.location.reload();
      });
  }

  // ngAfterViewInit() {
  //   const videoElement = document.getElementById(
  //     'my-video-0'
  //   ) as HTMLVideoElement;
  //   const sourceElement = document.getElementById(
  //     'src-0'
  //   ) as HTMLVideoElement;
  //   if (videoElement) {
  //     this.cdr.detectChanges();
  //     sourceElement.load();
  //     videoElement.load();
  //     videoElement.play();
  //   }
  // }

  onClickFinishTutorial() {
    this.tutorialProgress.isFinished = true;
    localStorage.setItem(
      TUTORIAL_PROGRESS,
      JSON.stringify(this.tutorialProgress)
    );
    this.router.navigate(['home/dashboard']);
  }
  trackByFn(index: number, item: any): any {
    return item.id; // or any unique identifier of your item
  }
}
