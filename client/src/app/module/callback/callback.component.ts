import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import apiConfig from "../../../environments/apiConfig";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // window.location.href = apiConfig.clientUrl;
    this.route.queryParams.subscribe(params => {
      const redirectUri = params['redirect_uri'];
      const project = params['project'];
      const email = params['email'];
      const displayName = params['displayName'];
      const username = params['username'];
      const profileImage = params['profileImage'];
      const authUid = params['authUid'];
      const token = params['token'];

      this.authService.params = {
        redirect_uri: redirectUri,
        project: project,
        platform: params['platform'] ? params['platform'].split(',') : [],
        email: email,
        displayName: displayName,
        username: username,
        profileImage: profileImage,
        authUid: authUid,
        token: token,
      };

      this.authService.setCurrentAuthUser(this.authService.params.token ?? "").subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(["/"]);
          }
        }
      });
    });
  }
}
