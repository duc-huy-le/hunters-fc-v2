import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { Router } from '@angular/router';
import { PrimaryButtonComponent } from '../../button/primary-button/primary-button.component';
import { HighlightTextComponent } from '../../text/highlight-text/highlight-text.component';
import { LinkTextComponent } from '../../text/link-text/link-text.component';

@Component({
  selector: 'app-course-block-alert',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, PrimaryButtonComponent, HighlightTextComponent, LinkTextComponent],
  templateUrl: './course-block-alert.component.html',
  styleUrl: './course-block-alert.component.css',
})
export class CourseBlockAlertComponent {
  constructor(private router: Router) {}
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
