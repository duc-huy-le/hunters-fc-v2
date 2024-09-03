import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../shared/auth/auth.service';
import { LoadingService } from '../../../services/common/loading.service';
import { Observable, catchError, from, map } from 'rxjs';
import { BaseComponent } from '../../common/base/base.component';
import { checkAuthResponseSuccess } from '../../../utils/Uitls';
import { checkValidForm, getUserHomepage } from '../../../helpers/Helpers';
import { UserService } from '../../../shared/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends BaseComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
    private msg: NzMessageService,
    private router: Router,
    protected override userService: UserService,
  ) {
    super(userService);
    // this.loadingService.setLoading(false);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  // login() {
  //   this.loadingService.setLoading(true);
  //   from(this.authService.login(this.loginForm.value))
  //     .pipe(
  //       map((res) => {
  //         if(res?.code === 200) {
  //           this.msg.success("Login successfully!");
  //         } else {
  //           this.msg.error('Invalid email or password!');
  //         }
  //         return res;
  //       }),
  //       catchError((e) => {
  //         const errorMessage = e.error.message;
  //         if (errorMessage === 'authentication_error') {
  //           this.msg.error('Invalid email or password!');
  //         } else {
  //           this.msg.error("Something went wrong.")
  //         }
  //         this.loadingService.setLoading(false);
  //         return new Observable((observer) => {
  //           observer.error(e);
  //         });
  //       })
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.loadingService.setLoading(false);
  //       },
  //       error: (error) => {
  //         console.error('An error occurred:', error);
  //       },
  //     });
  // }
  login() {
    checkValidForm(this.loginForm);
    if (this.loginForm.valid) {
      this.loadingService.setLoading(true);

      this.authService
        .login(this.loginForm.getRawValue())
        .toPromise()
        .then((res) => {
          if (res?.code === 200) {
            this.msg.success('Đăng nhập thành công!');
          } else {
            this.msg.error('Email hoặc mật khẩu không hợp lệ!');
          }
        })
        .catch((e) => {
          const errorMessage = e.error.message;
          if (errorMessage === 'authentication_error') {
            this.msg.error('Email hoặc mật khẩu không hợp lệ!');
          } else {
            this.msg.error('Đã xảy ra lỗi');
          }
          this.loadingService.setLoading(false);
        })
        .finally(() => {
          this.loadingService.setLoading(false);
        });
    }
  }

  navigateToDashBoard() {
    this.router.navigate([getUserHomepage(this.userInfo?.role)]);
  }
}
