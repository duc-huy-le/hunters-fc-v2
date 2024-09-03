import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [NgZorroAntdModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent {
  onClickContact(): void {
    window.open('https://www.facebook.com/ASMLink', '_blank');
  }
}
