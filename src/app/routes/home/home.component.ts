import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService, Role } from '../../shared/auth/auth.service';
import { RoleHomepage, USER_INFO } from '../../constants/constants';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { UserService } from '../../shared/user/user.service';
import { getUserHomepage } from '../../helpers/Helpers';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HighlightTextComponent } from '../../components/text/highlight-text/highlight-text.component';
import { NewFeatureModalComponent } from '../../components/modals/new-feature-modal/new-feature-modal.component';


interface NotificationList {
  titleNotification: string;
  content: string;
  redirect: string;
}

interface MenuItem {
  label: string;
  path: string;
  iconClass: string;
  showPermission: Role[];
  unlockPermission: Role[];
  isShow: boolean;
  isLock: boolean;
}

interface ListMenu extends MenuItem {
  sub_menu: MenuItem[];
  isShowSideBar: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, NgZorroAntdModule, HighlightTextComponent, NewFeatureModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userInfo: any;
  userRole!: number;
  avatarCharacter!: string; // Lưu chữ cái được hiển thị trong avatar của user
  currentRoute!: string;
  currentBalance!: number;
  currentWallet!: number;
  isShowWallets: boolean = false;
  isShowAdsNotification: boolean = false;
  isShowUpgradeAccountNotification: boolean = false;
  isShowAlmostGoneWalletNotification: boolean = false;
  salePrice!: number;
  salePercent!: number;
  // Hạn cuối cùng nhận được khuyến mãi hiện tại
  saleDeadline!: number;
  readonly Role = Role;
  userAccountPackageList: any[] = [
    {
      role: Role.PremiumUser,
      color: 'purple',
      label: 'Gói Premium',
    },
    {
      role: Role.ProUser,
      color: 'green',
      label: 'Gói Pro',
    },
    {
      role: Role.UnlimitedUser,
      color: 'gold',
      label: 'Gói Unlimited',
    },
    {
      role: Role.TrialUser,
      color: 'yellow',
      label: 'Gói dùng thử',
    },
    // {
    //   role: Role.ProUser, Role.PremiumUser,
    //   color: 'purple',
    //   label: 'Bootcamp Premium',
    // },
  ];

  notificationMenuList: NotificationList[] = [
    {
      titleNotification: 'Trải nghiệm dịch vụ hỗ trợ của ASMLink',
      content:
        'ASMLink cung cấp thêm cho anh chị thêm nhiều dịch vụ hộ trợ như mua tài khoản invoice, chứng minh traffic, otc,...',
      redirect: '/home/invoice-store',
    },
    // {
    //   titleNotification: 'Trải nghiệm dịch vụ hỗ trợ của ASMLink',
    //   content:
    //     'ASMLink cung cấp thêm cho anh chị thêm nhiều dịch vụ hộ trợ như mua tài khoản invoice, chứng minh traffic, otc,...',
    //   redirect: '/home/invoice-store',
    // },
    // {
    //   titleNotification: 'Trải nghiệm dịch vụ hỗ trợ của ASMLink',
    //   content:
    //     'ASMLink cung cấp thêm cho anh chị thêm nhiều dịch vụ hộ trợ như mua tài khoản invoice, chứng minh traffic, otc,...',
    //   redirect: '/home/invoice-store',
    // },
  ];

  menuList: MenuItem[] = [
    {
      label: 'Khóa học Bootcamp starter',
      path: '/home/bootcamp-training',
      iconClass: 'fas fa-campground',
      showPermission: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.TrialUser],
      unlockPermission: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.TrialUser],
      isShow: false,
      isLock: true,
    },
    {
      label: 'Khóa học bọc link',
      path: '/home/tutorial',
      iconClass: 'fas fa-question-circle',
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
    },
    {
      label: 'Tổng quan',
      path: '/home/dashboard',
      iconClass: 'fas fa-chart-line',
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
      ],
      isShow: false,
      isLock: true,
    },
    {
      label: 'Ref',
      path: '/home/ref',
      iconClass: 'fas fa-link',
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
      ],
      isShow: false,
      isLock: true,
    },
    {
      label: 'Dự án',
      path: '/home/project',
      iconClass: 'fab fa-buffer',
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
      ],
      isShow: false,
      isLock: true,
    },
    // {
    //   label: 'Redirect',
    //   path: '/home/redirect',
    //   iconClass: 'fas fa-directions',
    //   showPermission: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.UnlimitedUser],
    //   isShow: false,
    //   isLock: true,
    // },

    {
      label: 'Chương trình Affiliate',
      path: '/home/affiliate-program',
      iconClass: 'fas fa-bullhorn',
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.AffiliateUser,
        Role.TrialUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.AffiliateUser,
        Role.TrialUser,
      ],
      isShow: false,
      isLock: true,
    },
  ];
  listMenu: ListMenu[] = [
    {
      label: 'Hướng dẫn sử dụng',
      path: '',
      iconClass: 'fas fa-chevron-down',
      sub_menu: [
        {
          label: 'Khóa học Bootcamp starter',
          path: '/home/bootcamp-training',
          iconClass: 'fas fa-campground',
          showPermission: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.TrialUser],
          unlockPermission: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.TrialUser],
          isShow: false,
          isLock: true,
        },
        {
          label: 'Khóa học bọc link',
          path: '/home/tutorial',
          iconClass: 'fas fa-question-circle',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
          isShow: false,
          isLock: true,
        },
      ],
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
      isShowSideBar: true,
    },
    {
      label: 'Hệ thống bọc link',
      path: '',
      iconClass: 'fas fa-chevron-down',
      sub_menu: [
        {
          label: 'Tổng quan',
          path: '/home/dashboard',
          iconClass: 'fas fa-chart-line',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
        {
          label: 'Ref',
          path: '/home/ref',
          iconClass: 'fas fa-link',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
        {
          label: 'Dự án',
          path: '/home/project',
          iconClass: 'fab fa-buffer',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
        {
          label: 'Chiến dịch',
          path: '/home/campaign',
          iconClass: 'fas fa-window-restore',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
      ],
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
      isShowSideBar: true,
    },
    {
      label: 'Dịch vụ hỗ trợ',
      path: '',
      iconClass: 'fas fa-chevron-down',
      sub_menu: [
        {
          label: 'Mua tài khoản invoice',
          path: '/home/invoice-store',
          iconClass: 'fas fa-store',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
        {
          label: 'Chứng minh traffic',
          path: '/home/traffic-proof',
          iconClass: 'fas fa-blog',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
        {
          label: 'Dịch vụ OTC',
          path: '/home/otc-services',
          iconClass: 'fas fa-comments-dollar',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
      ],
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
      isShowSideBar: true,
    },
    // {
    //   label: 'Chợ ads',
    //   path: '',
    //   iconClass: 'fas fa-chevron-down',
    //   sub_menu: [
    //     {
    //       label: 'Tất cả gian hàng',
    //       path: '/home/ads-market',
    //       iconClass: 'fas fa-store',
    //       showPermission: [
    //         Role.Admin,
    //         Role.ProUser, Role.PremiumUser,
    //         Role.UnlimitedUser,
    //         Role.AffiliateUser,
    //         Role.TrialUser,
    //       ],
    //       unlockPermission: [
    //         Role.Admin,
    //         Role.ProUser, Role.PremiumUser,
    //         Role.UnlimitedUser,
    //         Role.AffiliateUser,
    //         Role.TrialUser,
    //       ],
    //       isShow: false,
    //       isLock: true,
    //     },
    //     {
    //       label: 'Gian hàng của tôi',
    //       path: '/home/my-ads-offer',
    //       iconClass: 'fas fa-warehouse',
    //       showPermission: [
    //         Role.Admin,
    //         Role.ProUser, Role.PremiumUser,
    //         Role.UnlimitedUser,
    //         Role.AffiliateUser,
    //         Role.TrialUser,
    //       ],
    //       unlockPermission: [
    //         Role.Admin,
    //         Role.ProUser, Role.PremiumUser,
    //         Role.UnlimitedUser,
    //         Role.AffiliateUser,
    //         Role.TrialUser,
    //       ],
    //       isShow: false,
    //       isLock: true,
    //     },
    //     {
    //       label: 'Đề xuất hợp tác',
    //       path: '/home/deal-ticket-list',
    //       iconClass: 'fas fa-handshake',
    //       showPermission: [
    //         Role.Admin,
    //         Role.ProUser, Role.PremiumUser,
    //         Role.UnlimitedUser,
    //         Role.AffiliateUser,
    //         Role.TrialUser,
    //       ],
    //       unlockPermission: [
    //         Role.Admin,
    //         Role.ProUser, Role.PremiumUser,
    //         Role.UnlimitedUser,
    //         Role.AffiliateUser,
    //         Role.TrialUser,
    //       ],
    //       isShow: false,
    //       isLock: true,
    //     },
    //   ],
    //   showPermission: [
    //     Role.Admin,
    //     Role.ProUser, Role.PremiumUser,
    //     Role.UnlimitedUser,
    //     Role.TrialUser,
    //     Role.AffiliateUser,
    //   ],
    //   unlockPermission: [
    //     Role.Admin,
    //     Role.ProUser, Role.PremiumUser,
    //     Role.UnlimitedUser,
    //     Role.TrialUser,
    //     Role.AffiliateUser,
    //   ],
    //   isShow: false,
    //   isLock: true,
    //   isShowSideBar: true,
    // },
    {
      label: 'Tài liệu quý',
      path: '',
      iconClass: 'fas fa-chevron-down',
      sub_menu: [
        {
          label: 'Danh sách 10k dự án',
          path: '/home/project-list',
          iconClass: 'fas fa-list-ul',
          showPermission: [Role.Admin, Role.ProUser, Role.PremiumUser],
          unlockPermission: [Role.Admin, Role.ProUser, Role.PremiumUser],
          isShow: false,
          isLock: true,
        },
      ],
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
      isShowSideBar: true,
    },
    {
      label: 'Chương trình affiliate',
      path: '',
      iconClass: 'fas fa-chevron-down',
      sub_menu: [
        {
          label: 'Chương trình Affiliate',
          path: '/home/affiliate-program',
          iconClass: 'fas fa-bullhorn',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
      ],
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
      isShowSideBar: true,
    },
    {
      label: 'Điều khoản sử dụng',
      path: '',
      iconClass: 'fas fa-chevron-down',
      sub_menu: [
        {
          label: 'Chính sách nạp/rút tiền',
          path: '/home/top-up',
          iconClass: 'fas fa-hand-holding-usd mr-2',
          showPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          unlockPermission: [
            Role.Admin,
            Role.ProUser, Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
          isShow: false,
          isLock: true,
        },
      ],
      showPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      unlockPermission: [
        Role.Admin,
        Role.ProUser, Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
      isShow: false,
      isLock: true,
      isShowSideBar: true,
    },
  ];
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private msg: NzMessageService
  ) { }
  async ngOnInit(): Promise<void> {
    this.currentRoute = this.router.url; // Lấy đường dẫn hiện tại
    // this.currentBalance = this.authService.getBalance();
    await this.fetchUserInfo();

  }

  async fetchUserInfo() {
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userInfo = data;
      this.avatarCharacter = this.userInfo?.name.slice(0, 1); // Lấy chữ cái đầu tiên trong tên của user để cho vào avatar
      this.currentBalance = this.userInfo?.balance;
      this.currentWallet = this.userInfo?.wallet;
      this.userRole = Number(this.userInfo?.role);
      this.handleShowNotification(this.userRole);
      this.handleListMenuVisibility(this.userRole);
      this.handleMenuVisibility(this.userRole);
      this.handleListMenuUnlock(this.userRole);
      this.handleMenuLock(this.userRole);
      this.handleWalletVisibility(this.userRole);
      this.calculateSaleDeadline(this.userInfo?.created_at);
    });
  }
  calculateSaleDeadline(createdAt: string) {
    const userCreatedAccTime = new Date(createdAt);
    // Tính thời gian từ lúc tạo tài khoản đến nay
    const differentInTime = Date.now() - userCreatedAccTime.getTime();
    // Nếu tạo tk cách đây dưới 7 ngày thì
    if (differentInTime <= 1000 * 60 * 60 * 24 * 7) {
      this.salePrice = 700;
      this.saleDeadline = userCreatedAccTime.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 30;
    } else if (differentInTime <= 1000 * 60 * 60 * 24 * 14) {
      this.salePrice = 900;
      this.saleDeadline = userCreatedAccTime.getTime() + 1000 * 60 * 60 * 24 * 14 + 1000 * 30;
    } else if (differentInTime <= 1000 * 60 * 60 * 24 * 21) {
      this.salePrice = 1100;
      this.saleDeadline = userCreatedAccTime.getTime() + 1000 * 60 * 60 * 24 * 21 + 1000 * 30;
    }
    this.salePercent = 1 - (this.salePrice / 1300);
  }

  handleListMenuVisibility(userRole: any) {
    this.listMenu.forEach((item) => {
      if (item.showPermission.includes(userRole)) {
        item.isShow = true;
        if (item.sub_menu.length > 0) {
          item.sub_menu.forEach((element) => {
            if (element.showPermission.includes(userRole))
              element.isShow = true;
          });
        }
      }
    });
  }

  handleListMenuUnlock(userRole: any) {
    this.listMenu.forEach((item) => {
      if (item.unlockPermission.includes(userRole)) {
        item.isLock = false;
        if (item.sub_menu.length > 0) {
          item.sub_menu.forEach((element) => {
            if (element.unlockPermission.includes(userRole))
              element.isLock = false;
          });
        }
      }
    });
  }

  handleMenuVisibility(userRole: any) {
    this.menuList.forEach((item) => {
      if (item.showPermission.includes(userRole)) {
        item.isShow = true;
      }
    });
  }
  handleMenuLock(userRole: any) {
    this.menuList.forEach((item) => {
      if (item.unlockPermission.includes(userRole)) {
        item.isLock = false;
      }
    });
  }

  handleWalletVisibility(userRole: any) {
    if (
      userRole === Role.Admin ||
      userRole === Role.ProUser, Role.PremiumUser ||
      userRole === Role.UnlimitedUser ||
      userRole === Role.TrialUser ||
      userRole === Role.AffiliateUser
    ) {
      this.isShowWallets = true;
    }
  }

  handleShowNotification(userRole: any) {
    // Ẩn tất cả các thông báo đi rồi hiển thị đúng thông báo cần thiết với đúng loại user
    this.isShowAdsNotification = false;
    this.isShowUpgradeAccountNotification = false;
    this.isShowAlmostGoneWalletNotification = false;
    if (userRole === Role.TrialUser || userRole === Role.AffiliateUser) {
      this.isShowUpgradeAccountNotification = true;
    } else if (this.currentBalance < 5000000) {
      this.isShowAlmostGoneWalletNotification = true;
    } else {
      this.isShowAdsNotification = true;
    }
  }

  handleChildMenuVisibility(Element: ListMenu): void {
    Element.isShowSideBar = !Element.isShowSideBar;
  }

  onClickNav(menuItem: any) {
    // Thay đổi biến currentRoute theo path của nav vừa được chọn
    this.currentRoute = menuItem.path;
    this.router.navigate([menuItem.path]);
    if (menuItem?.isLock === true) {
      this.msg.warning(
        'To unlock more advanced features, consider topping up to our premium plan.'
      );
    }
    const userRole = Number(this.userInfo?.role);
    this.handleShowNotification(userRole);
  }
  logout(): void {
    this.authService.logout();
  }
  goToTutorial(): void {
    this.router.navigate(['/home/tutorial']);
  }
  goToTransactionHistory(): void {
    this.router.navigate(['/home/transaction-history']);
  }
  goToTutorial2(): void {
    this.router.navigate(['/home/tutorial'], { queryParams: { chapter: 2 } });
  }
  goToHome(): void {
    this.router.navigate([getUserHomepage(this.userInfo?.role)]);
  }
  goToTopUpLandingPage(): void {
    window.open(
      'https://asmlink.com/giai-phap-boc-link-google-ads/chinh-sach-nap-rut-balance/',
      '_blank'
    );
  }
  countNotification(): number {
    return this.notificationMenuList.length;
  }

  goToRedirect(notification: NotificationList): void {
    this.currentRoute = notification.redirect;
    this.router.navigate([notification.redirect]);
  }
  onClickServices(): void {
    window.open('https://asmlink.com/giai-phap-boc-link-google-ads/pricing/', '_blank');
  }
}
