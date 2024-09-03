import { UserService } from './shared/user/user.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/common/loading.service';
import { NgZorroAntdModule } from './ng-zorro-antd.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgZorroAntdModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ASMLink';
  isLoading: boolean = false;
  loadingMessage: string = 'Loading...';

  constructor(
    // private authService: AuthService,
    private loadingService: LoadingService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadingService.loading$.subscribe((data) => {
      this.isLoading = data;
      this.cdr.detectChanges();
    });
  }

  // sendMessageToTelegram() {
  //   this.notificationService
  //     .sendMessage('5426764053', 'adsf\nALoo')
  //     .toPromise()
  //     .then((res) => {});
  // }
}
