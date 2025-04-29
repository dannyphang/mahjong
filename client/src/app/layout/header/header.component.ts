import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService, UserDto } from '../../core/services/auth.service';
import { DEFAULT_PROFILE_PIC_URL } from '../../core/shared/constants/common.constants';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { ThemeService } from '../../core/services/theme.service';
import { EventService } from '../../core/services/event.service';
import apiConfig from '../../../environments/apiConfig';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() user: UserDto;

  isDarkMode: boolean = false;
  darkThemeFile: string = "aura-dark-blue.css";
  lightThemeFile: string = "aura-light-blue.css";

  menuItem: MenuItem[] = [];
  searchFormControl: FormControl = new FormControl("");
  userMenuItem: MenuItem[] | undefined;
  languageMenuItem: MenuItem[] | undefined;
  currentUser: UserDto;
  isAutoFocus: boolean = false;
  DEFAULT_PROFILE_PIC_URL = DEFAULT_PROFILE_PIC_URL;
  avatarImage: string | null = this.DEFAULT_PROFILE_PIC_URL;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthService,
    private commonService: CommonService,
    private themeService: ThemeService,
    private eventService: EventService,
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.avatarImage = this.user.profilePhotoUrl ?? this.DEFAULT_PROFILE_PIC_URL;

      this.initAvatarMenu();// update theme
      this.updateThemeMode(this.user.setting.darkMode ?? false, true);
    }
  }

  updateThemeMode(isDark: boolean, isInit = false) {
    this.isDarkMode = isDark;
    this.themeService.switchTheme(isDark ? this.darkThemeFile : this.lightThemeFile);
    if (!isInit) {
      this.authService.updateUserFirestore([{
        email: this.authService.userC.email,
        lastActiveDateTime: new Date(),
        uid: this.authService.userC.uid,
        username: this.authService.userC.username,
        setting: {
          ...this.authService.userC.setting,
          darkMode: isDark
        }
      }]).subscribe(res => {
        if (res.isSuccess) {

        }
      })
    }
    this.authService.getCurrentAuthUser().then(res => {
      this.currentUser = res;
      this.initAvatarMenu();
    });
  }

  initAvatarMenu() {
    this.userMenuItem = [
      {
        label: '',
      },
      {
        separator: true
      },
      {
        label: this.translateService.instant('BUTTON.LOGOUT'),
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.signOutUserAuth().subscribe(res => {
            // this.eventService.createEventLog("auth", "Log out", `${this.authService.userC.displayName} logged out.`);
            window.location.reload();
          });
        },
        visible: this.currentUser ? true : false
      },
      {
        label: this.translateService.instant('BUTTON.LOGIN'),
        icon: "pi pi-sign-in",
        command: () => {
          this.redirectToSignIn();
        },
        visible: this.currentUser ? false : true
      },
    ];
  }

  redirectToSignIn() {
    this.router.navigate(["/login"]);
  }

  redirectToSignUp() {
    window.location.href = apiConfig.authClient + "/signup?redirect_uri=" + apiConfig.clientUrl + "/callback&project=Mahjong";
  }

  ngOnInit() {
    this.userMenuItem = [
      {
        label: this.translateService.instant('BUTTON.LOGIN'),
        icon: "pi pi-sign-in",
        command: () => {
          this.redirectToSignIn();
        }
      },
      {
        label: this.translateService.instant('BUTTON.SIGNUP'),
        icon: "pi pi-user-plus",
        command: () => {
          this.redirectToSignUp();
        },
        visible: this.currentUser ? false : true
      },
    ];
  }

  profileClick() {
    this.router.navigate(['/profile']);
  }
}
