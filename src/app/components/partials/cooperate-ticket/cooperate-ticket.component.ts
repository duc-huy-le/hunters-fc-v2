import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoadingService } from '../../../services/common/loading.service';
export enum Device {
  Desktop = 'Desktop',
  Mobile = 'Mobile',
  Tablet = 'Tablet',
}
@Component({
  selector: 'app-cooperate-ticket',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cooperate-ticket.component.html',
  styleUrl: './cooperate-ticket.component.css',
})
export class CooperateTicketComponent {
  adsOffer!: any;
  ticketForm!: FormGroup;
  isVisibleAddTicketForm: boolean = false;
  formatterVnd = (value: number): string => `${new Intl.NumberFormat('de-DE').format(value)} đ`;
  parserVnd = (value: string): string => value.replace(' đ', '');
  keywordList: string[] = [];
  countryList: string[] = [];
  deviceList: any[] = [
    {
      value: Device.Desktop,
      label: 'Máy tính',
    },
    {
      value: Device.Mobile,
      label: 'Điện thoại',
    },
    {
      value: Device.Tablet,
      label: 'Máy tính bảng',
    }
  ]
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.initTicketForm();
  }
  initTicketForm(): void {
    this.ticketForm = this.fb.group({
      name: [null, [Validators.required]],
      refLink: [null, [Validators.required]],
      cpc: [null, [Validators.required]],
      countries: [null, [Validators.required]],
      keywords: [null, [Validators.required]],
      devices: [[Device.Desktop, Device.Mobile, Device.Tablet], [Validators.required]],
      offerId: [null, [Validators.required]],
      projectName: [null],
      projectHomepage: [null],
      status: [1, [Validators.required]],
    });
  }
  openTicketModal(adsOffer: any): void {
    this.isVisibleAddTicketForm = true;
    this.adsOffer = adsOffer;
    // this.ticketForm.setValue({
    //   projectName: adsOffer.projectName,
    // })
    this.ticketForm.get('cpc')?.setValue(adsOffer.cpc);
    this.ticketForm.get('projectName')?.setValue(adsOffer.projectName);
    this.ticketForm.get('projectHomepage')?.setValue(adsOffer.projectHomepage);
    this.ticketForm.get('projectName')?.disable();
    this.ticketForm.get('projectHomepage')?.disable();
    this.ticketForm.get('refLink')?.disable();
  }
  handleCancelTicket(): void {
    this.isVisibleAddTicketForm = false;
  }
  handleAddTicket(): void {}
}
