import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import apiConfig from "../../../environments/apiConfig";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent {
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    window.location.href = apiConfig.clientUrl;
  }
}
