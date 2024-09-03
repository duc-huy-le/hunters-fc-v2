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
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { LoadingService } from '../../../services/common/loading.service';
import { BaseComponent } from '../../common/base/base.component';
import { checkAuthResponseSuccess } from '../../../utils/Uitls';
import { IS_VALIDATING_ACC } from '../../../constants/constants';
import { checkValidForm } from '../../../helpers/Helpers';
import { UserService } from '../../../shared/user/user.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent extends BaseComponent {
  isShowRefererId: boolean = true;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
    private msg: NzMessageService,
    private router: Router,
    protected override userService: UserService
  ) {
    super(userService);
    // this.loadingService.setLoading(false);
  }

  override async ngOnInit(): Promise<void> {
    const is_validating_acc = localStorage.getItem(IS_VALIDATING_ACC);
    if (is_validating_acc === 'true') {
      this.router.navigate(['/register-successfully']);
    }
    super.ngOnInit();
    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      aff_id: [null],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    const cookies = this.getCookies();
    // const asmref = cookies.find((cookie) => cookie.includes('asmref'));
    const asmref = cookies.find((cookie) => cookie[0] === '_asmrf');
    if (asmref) {
      this.registerForm.get('aff_id')?.setValue(asmref[1]);
      // this.registerForm.get('aff_id')?.disable();
      this.isShowRefererId = false;
    }
  }

  register() {
    checkValidForm(this.registerForm);
    if (this.registerForm.valid) {
      this.loadingService.setLoading(true);
      from(this.authService.register(this.registerForm.value))
        .pipe(
          map((res) => {
            if (res?.code === 200) {
              this.msg.success('Đăng ký thành công!');
            } else {
              this.msg.error(res.message);
            }
            return res;
          }),
          catchError((e) => {
            if (
              e?.error?.code === 409 &&
              e?.error?.message === 'Email này đã được đăng ký.'
            ) {
              this.msg.error('Email đã tồn tại!');
            } else {
              this.msg.error('Có lỗi xảy ra. Vui lòng thử lại!');
            }
            this.loadingService.setLoading(false);
            return new Observable((observer) => {
              observer.error(e);
            });
          })
        )
        .subscribe({
          next: () => {
            this.loadingService.setLoading(false);
          },
          error: (error) => {
            console.error('Có lỗi xảy ra:', error);
          },
        });
    }
  }

  logout() {
    this.authService.logout();
  }

  getCookies(): string[] {
    const cookies: any[] = [];
    const cookiesString = document.cookie;
    if (cookiesString && cookiesString !== '') {
      const cookiePairs = cookiesString.split(';');
      cookiePairs.forEach((pair) => {
        const cookieParts = pair.split('=');
        // const cookieName = cookieParts[0].trim();
        // cookies.push(cookieName);
        cookies.push([cookieParts[0].trim(), cookieParts[1].trim()]);
      });
    }
    return cookies;
  }
}
