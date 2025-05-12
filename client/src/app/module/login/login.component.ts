import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
  ) { }


  ngOnInit() {
    // this.authService.initAuth();
    // this.initLoginForm();
    this.authService.callJWT();
  }
}
