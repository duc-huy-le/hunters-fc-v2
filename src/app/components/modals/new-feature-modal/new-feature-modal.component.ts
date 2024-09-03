import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-feature-modal',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, RouterModule],
  templateUrl: './new-feature-modal.component.html',
  styleUrl: './new-feature-modal.component.css'
})
export class NewFeatureModalComponent {
  isVisible: boolean = true;
  closeModal(): void {
    this.isVisible = false;
  }
  openModal(): void {
    this.isVisible = true;
  }
}
