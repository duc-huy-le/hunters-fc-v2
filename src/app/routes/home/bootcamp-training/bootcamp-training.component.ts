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
import { Lesson } from '../tutorial/tutorial.component';
import { UserService } from '../../../shared/user/user.service';
import { User } from '../../../models/User';
import { Role } from '../../../shared/auth/auth.service';
import { PrimaryButtonComponent } from '../../../components/button/primary-button/primary-button.component';
import { CourseBlockAlertComponent } from '../../../components/alert/course-block-alert/course-block-alert.component';

interface Document {
  index: number; // index < 0 cho tất cả, index >= 0 chỉ hiện tài liệu tại 1 vị trí cố định
  iconClass: string;
  type: string;
  link: string;
  isShow: boolean;
}

@Component({
  selector: 'app-bootcamp-training',
  standalone: true,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    PrimaryButtonComponent,
    CourseBlockAlertComponent,
  ],
  templateUrl: './bootcamp-training.component.html',
  styleUrl: './bootcamp-training.component.css',
})
export class BootcampTrainingComponent {
  tutorialProgress!: TutorialProgress;
  currentChapterTabIndex: number = 0;
  userInfo!: User;
  userRole!: Role;
  isTrialUser: boolean = false;
  acceptRole: Role[] = [Role.Admin, Role.ProUser];
  documentList: Document[] = [
    {
      index: 0,
      iconClass: 'fa-solid fa-link',
      type: 'Sheet điền data',
      link: 'https://docs.google.com/spreadsheets/d/1VzcomLd7CjE5EEseBSo4poLB0W6Ng5cH-caLsLWDvjA',
      isShow: true,
    },
  ];
  chapterOneList: Lesson[] = [
    {
      name: 'Bài 4: Hành trình của ASMLink',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output1.m3u8',
    },
    {
      name: 'Bài 5: Điểm mạnh của mô hình Affiliate với Google Ads',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output2.m3u8',
    },
    {
      name: 'Bài 6: Sử dụng đòn bẩy sản phẩm',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output3.m3u8',
    },
    {
      name: 'Bài 7: Sử dụng đòn bẩy traffic',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output4.m3u8',
    },
    {
      name: 'Bài 8: Chiến lược thả câu',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output5.m3u8',
    },
    {
      name: 'Bài 9: Cần gì để bắt đầu với affiliate paid traffic',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output6.m3u8',
    },
    {
      name: 'Bài 10: Sử dụng đòn bẩy tài chính',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output7.m3u8',
    },
    {
      name: 'Bài 11: Những rủi ro nào đang rình rập ta',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output8.m3u8',
    },
    {
      name: 'Bài 12: Sử dụng đòn bẩy công nghệ',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output9.m3u8',
    },
    {
      name: 'Bài 13: Giới thiệu các tính năng của hệ thống ASMLink',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output10.m3u8',
    },
    {
      name: 'Bài 14: Các tính năng phát triển tiếp theo',
      isActive: false,
      isDisabled: false,
      videoPath: '../../../../assets/videos/bootcamp/chapter1/output11.m3u8',
    },
  ];
  chapterTwoList: Lesson[] = [
    {
      name: 'Bài 1.1: Giới thiệu quy trình research dự án và hướng dẫn sử dụng sheet làm việc',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output1.m3u8',
    },
    {
      name: 'Bài 1.2: Hướng dẫn điền sheet Quản lý thông tin dự án',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output1_2.m3u8',
    },
    {
      name: 'Bài 1.3: Hướng dẫn điền sheet Quản lý tài khoản affiliate của dự án',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output1_3.m3u8',
    },
    {
      name: 'Bài 2: Tiêu chí lựa chọn dự án cơ bản và nâng cao',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output2.m3u8',
    },
    {
      name: 'Bài 3.1: Chọn ngách dự án và bộ công cụ Research',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output3.m3u8',
    },
    {
      name: 'Bài 3.2: Các cách research dự án',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output3_2.m3u8',
    },
    {
      name: 'Bài 4: Sử dụng các công cụ tìm kiếm',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output4.m3u8',
    },
    {
      name: 'Bài 4.2: Cách 1 sử dụng công cự tìm kiếm Similarweb',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output4_2.m3u8',
    },
    {
      name: 'Bài 4.3: Cách 2 sử dụng công cự tìm kiếm Ads Transparency',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output4_3.m3u8',
    },
    {
      name: 'Bài 5: Hướng dẫn check volume traffic bằng keyword planner',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output5.m3u8',
    },
    {
      name: 'Bài 6.1: Cách đăng ký tài khoản (Phần 1)',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output6.m3u8',
    },
    {
      name: 'Bài 6.2: Cách đăng ký tài khoản (Phần 2)',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter2/output6_2.m3u8',
    },
    // {
    //   name: 'Buổi 7: Cách check ghi nhận click 3 source trong tài khoản',
    //   isActive: false,
    //   isDisabled: false,
    //   videoPath: '../../../../assets/videos/bootcamp/chapter2/output7.m3u8',
    // },
    // {
    //   name: 'Buổi 8: Giới thiệu sheet dự án black list',
    //   isActive: false,
    //   isDisabled: false,
    //   videoPath: '',
    // },
  ];
  chapterThreeList: Lesson[] = [
    {
      name: 'Giới thiệu tổng quan về ads',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output1.m3u8',
    },
    {
      name: 'Hướng dẫn tạo tài khoản Google Ads một cách nhanh chóng',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output2.m3u8',
    },
    {
      name: 'Hướng dẫn tạo tài khoản Google Ads một cách nhanh chóng (Cách 2)',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output2_2.m3u8',
    },
    {
      name: 'Cấu trúc tài khoản quảng cáo - 1 tài khoản ads lên 1 camp duy nhất',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output2_3.m3u8',
    },
    // {
    //   name: 'Giới thiệu về tài khoản quản lý MCC (Đang cập nhật)',
    //   isActive: false,
    //   isDisabled: true,
    //   videoPath: '../../../../assets/videos/bootcamp/chapter3/output3.m3u8',
    // },
    {
      name: 'Hướng dẫn cách lên ads cơ bản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output4.m3u8',
    },
    {
      name: 'Hướng dẫn cách lên ads cơ bản (Phần 2)',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output4_2.m3u8',
    },
    // {
    //   name: 'Tạo chiến dịch rỗng',
    //   isActive: false,
    //   isDisabled: true,
    //   videoPath: '../../../../assets/videos/bootcamp/chapter3/output5.m3u8',
    // },
    // {
    //   name: 'Thêm từ khóa cho chiến dịch',
    //   isActive: false,
    //   isDisabled: true,
    //   videoPath: '../../../../assets/videos/bootcamp/chapter3/output6.m3u8',
    // },
    // {
    //   name: 'Thêm mẫu quảng cáo cho chiến dịch',
    //   isActive: false,
    //   isDisabled: true,
    //   videoPath: '../../../../assets/videos/bootcamp/chapter3/output7.m3u8',
    // },
    // {
    //   name: 'Cài chiến lược giá thầu cho chiến dịch',
    //   isActive: false,
    //   isDisabled: true,
    //   videoPath: '../../../../assets/videos/bootcamp/chapter3/output8.m3u8',
    // },
    {
      name: 'Các phần quảng cáo mở rộng',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output9.m3u8',
    },
    {
      name: 'Tối ưu về vị trí hiển thị cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output10.m3u8',
    },
    {
      name: 'Tối ưu về thiết bị hiển thị cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output11.m3u8',
    },
    {
      name: 'Hướng dẫn nạp tiền cho tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output12.m3u8',
    },
    {
      name: 'Hủy tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output13.m3u8',
    },
    {
      name: 'Cách kháng tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output14.m3u8',
    },
    {
      name: 'Cách hủy tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3/output15.m3u8',
    },
  ];
  chapterThreeListOld: Lesson[] = [
    {
      name: 'Tạo tài khoản google ads',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output1.m3u8',
    },
    {
      name: 'Tạo tài khoản MCC',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output2.m3u8',
    },
    {
      name: 'Thêm tài khoản vào MCC',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output3.m3u8',
    },
    {
      name: 'Thêm hồ sơ thanh toán cho tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output4.m3u8',
    },
    {
      name: 'Tạo chiến dịch rỗng',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output5.m3u8',
    },
    {
      name: 'Thêm từ khóa cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output6.m3u8',
    },
    {
      name: 'Thêm mẫu quảng cáo cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output7.m3u8',
    },
    {
      name: 'Cài chiến lược giá thầu cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output8.m3u8',
    },
    {
      name: 'Thêm final url cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output9.m3u8',
    },
    {
      name: 'Thêm bọc link cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output10.m3u8',
    },
    {
      name: 'Cài đặt thiết bị hiển thị quảng cáo',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output11.m3u8',
    },
    {
      name: 'Nạp tiền cho chiến dịch',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output12.m3u8',
    },
    {
      name: 'Hủy tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output13.m3u8',
    },
    {
      name: 'Kháng tài khoản',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output14.m3u8',
    },
    {
      name: 'Toàn bộ quy trình chạy quảng cáo',
      isActive: false,
      isDisabled: true,
      videoPath: '../../../../assets/videos/bootcamp/chapter3Old/output15.m3u8',
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }
  async ngOnInit() {
    // Lấy thông tin user
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userInfo = data;
      this.userRole = Number(this.userInfo?.role);
      if (this.userRole === Role.TrialUser) this.isTrialUser = true;

      // Mở khóa chương 2 và chương 3 cho các user Pro
      this.chapterTwoList.forEach((item) => {
        if (
          this.userRole === Role.Admin ||
          this.userRole === Role.PremiumUser ||
          this.userRole === Role.ProUser
        ) {
          // Unlock toàn bộ bài học trong chương 2 bằng cách chuyển trường disabled của các bài học thành false
          item.isDisabled = false;
        } else if (this.isTrialUser) {
          item.videoPath = '';
        }
      });
      // Unlock toàn bộ bài học trong chương 3 bằng cách chuyển trường disabled của các bài học thành false
      this.chapterThreeList.forEach((item) => {
        if (
          this.userRole === Role.Admin ||
          this.userRole === Role.PremiumUser ||
          this.userRole === Role.ProUser
        ) {
          // Unlock toàn bộ bài học trong chương 2 bằng cách chuyển trường disabled của các bài học thành false
          item.isDisabled = false;
        } else if (this.isTrialUser) {
          item.videoPath = '';
        }
      });
    });
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
      // location.href = '/home/bootcamp-training?chapter=1';
    } else if (e === 1) {
      queryParams['chapter'] = '2'; // Add ?chapter=2
      // location.href = '/home/bootcamp-training?chapter=2';
    } else if (e === 2) {
      queryParams['chapter'] = '3'; // Add ?chapter=3
      // location.href = '/home/bootcamp-training?chapter=3';
    }
    this.router
      .navigate(['home/bootcamp-training'], { queryParams: queryParams })
      .then(() => {
        window.location.reload();
      });
  }

  // ngAfterViewInit() {
  //   const videoElement = document.getElementById(
  //     'my-video-0'
  //   ) as HTMLVideoElement;
  //   const sourceElement = document.getElementById('src-0') as HTMLVideoElement;
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
  onClickUpgrade(): void {
    window.open(
      'https://asmlink.com/giai-phap-boc-link-google-ads/pricing/',
      '_blank'
    );
  }
  onClickContinueFree(): void {
    this.router.navigate(['home/bootcamp-training'], {
      queryParams: {
        chapter: 1,
      },
    });
  }
}
