import { LoadingService } from './../../../services/common/loading.service';
import { TransactionService } from './../../../services/transaction/transaction.service';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../shared/user/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent {
  loadingTable: boolean = false;
  isVisibleExchangeMoneyModal: boolean = false;
  confirmText: string =
    'Are you sure exchange money from your VND wallet to your ASM wallet?';
  listOfData: any[] = [];
  exchangeAmount: number = 2000000;
  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private msg: NzMessageService,
    private LoadingService: LoadingService
  ) { }
  ngOnInit(): void {
    this.getAllUserTransaction();
  }
  getAllUserTransaction() {
    this.loadingTable = true;
    this.transactionService
      .getAllUserTransaction()
      .toPromise()
      .then((res) => {
        if (res?.code === 200) {
          this.listOfData = res?.data;
          this.listOfData = [
            ...this.listOfData?.map((item) => {
              item.id = Number.parseInt(item.id);
              return item;
            }).sort((a, b) => b.id - a.id),
          ];
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.loadingTable = false;
      });
  }
  onClickExchangeMoney() {
    this.isVisibleExchangeMoneyModal = true;
  }
  handleOkExchangeMoneyModal() {
    const formattedMoney = new Intl.NumberFormat('de-DE').format(
      this.exchangeAmount
    );
    this.confirmText = `Are you sure exchange ${formattedMoney} đ from your VND wallet to your ASM wallet?`;
  }
  handleCancelExchangeMoneyModal() {
    this.isVisibleExchangeMoneyModal = false;
  }
  async acceptExchange() {
    this.LoadingService.setLoading(true);
    const exchangePayload = {
      amount: this.exchangeAmount,
    };
    await this.userService
      .exchangeMoney(exchangePayload)
      .toPromise()
      .then((res) => {
        if (res?.code === 200) {
          this.msg.success('Exchange money successfully!');
          this.isVisibleExchangeMoneyModal = false;
        }
      }).catch((error) => {
        console.error(error);
        if (error?.error?.code === 409) {
          this.msg.error(error?.error?.message);
        }
      })
      .finally(() => {
        this.LoadingService.setLoading(false);
      });
  }
  formatterVnd = (value: number): string => `${new Intl.NumberFormat('de-DE').format(value)} đ`;
  parserVnd = (value: string): string => value.replace(' đ', '');
}
