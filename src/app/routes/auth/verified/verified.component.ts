import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-verified',
  standalone: true,
  imports: [NgZorroAntdModule, RouterModule],
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.css',
})
export class VerifiedComponent {}
