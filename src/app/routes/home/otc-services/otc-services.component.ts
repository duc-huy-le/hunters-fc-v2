import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';

@Component({
  selector: 'app-otc-services',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule],
  templateUrl: './otc-services.component.html',
  styleUrl: './otc-services.component.css',
})
export class OtcServicesComponent {
  goToASMLinkFanpage(): void {
    window.open('https://www.facebook.com/ASMLink', '_blank');
  }
}
