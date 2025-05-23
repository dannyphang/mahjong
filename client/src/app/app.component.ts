import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { ToastComponent } from './core/shared/components/toast/toast.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mahjong';

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    // inject();
    this.translateService.use('en');

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const newColorScheme = event.matches ? "dark" : "light";
      console.log(newColorScheme)
    });
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
    }
    else {
      // light mode
    }
  }

  ngOnInit() {

  }
}
