import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@vercel/analytics';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-setup-base';

  constructor(
    private translateService: TranslateService,
    private authService: AuthService
  ) {
    inject();
    this.translateService.use('zh');

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
