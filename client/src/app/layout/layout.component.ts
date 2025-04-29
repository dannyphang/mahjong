import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UserDto } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  helpDialogVisible: boolean = false;
  translateVisible: boolean = true;
  user: UserDto;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.authService.getCurrentAuthUser().then(user => {
      this.user = user;
    })
  }

  @HostListener("window:keydown", ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "?") {
      this.helpDialogVisible = !this.helpDialogVisible;
    }
    else if (event.key === "t") {
      this.translateVisible = !this.translateVisible;

      if (this.translateVisible) {
        this.translateService.use('zh');
      }
      else {
        this.translateService.use('en');
      }
    }
  }
}
