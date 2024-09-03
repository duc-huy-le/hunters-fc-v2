import { Component } from '@angular/core';
import { USER_INFO } from '../../../constants/constants';
import { UserService } from '../../../shared/user/user.service';
import { Role } from '../../../shared/auth/auth.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css',
})
export class BaseComponent {
  isTrialMode: boolean = false;
  userInfo: any;
  userRole: any;
  isLoggedIn: boolean = false;
  constructor(protected userService: UserService) {}
  async ngOnInit(): Promise<void> {
    this.userService.subscribeUserInfo().subscribe((data) => {
      this.userInfo = data;
      this.userRole = Number(this.userInfo?.role);
      this.isTrialMode = this.userRole === 5; //TODO: Role.TrialUser chứ dùng số fix cứng thế này là không được
      if (data?.uuid) this.isLoggedIn = true;
    });
  }
}
