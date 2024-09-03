import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
