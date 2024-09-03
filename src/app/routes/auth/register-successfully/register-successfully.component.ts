import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import {
  IS_PROCESSING_LOGIN,
  IS_VALIDATING_ACC,
} from '../../../constants/constants';

@Component({
  selector: 'app-register-successfully',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule],
  templateUrl: './register-successfully.component.html',
  styleUrl: './register-successfully.component.css',
})
export class RegisterSuccessfullyComponent {
  constructor(private router: Router) {}
  onClickContact() {
    window.open('https://www.facebook.com/ASMLink', '_blank');
  }
  onClickLoginAnother() {
    this.router.navigate(['/login']);
    localStorage.removeItem(IS_PROCESSING_LOGIN);
  }
}
