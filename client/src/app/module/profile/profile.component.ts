import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CONTROL_TYPE, FormConfig } from '../../core/services/components.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileFormGroup: FormGroup = new FormGroup({
    photoUrl: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
  });
  profileFormConfig: FormConfig[] = [];

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.authService.userC) {
      this.profileFormGroup.patchValue({
        photoUrl: this.authService.userC.profilePhotoUrl,
        username: this.authService.userC.username,
        email: this.authService.userC.email,
        displayName: this.authService.userC.displayName,
      });
    }
    else {
      this.authService.getCurrentAuthUser().then(user => {
        this.authService.userC = user;
        this.profileFormGroup.patchValue({
          photoUrl: user.profilePhotoUrl,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
        });
      });
    }
  }

  initForm() {
    this.profileFormConfig = [
      {
        label: 'INPUT.EMAIL',
        type: CONTROL_TYPE.Textbox,
        fieldControl: this.profileFormGroup.get('email'),
        layoutDefine: {
          row: 0,
          column: 0
        }
      },
      {
        label: 'INPUT.USERNAME',
        type: CONTROL_TYPE.Textbox,
        fieldControl: this.profileFormGroup.get('username'),
        layoutDefine: {
          row: 1,
          column: 0
        },
        disabled: true
      },
      {
        label: 'INPUT.DISPLAY_NAME',
        type: CONTROL_TYPE.Textbox,
        fieldControl: this.profileFormGroup.get('displayName'),
        layoutDefine: {
          row: 1,
          column: 1
        }
      }
    ];
  }

  profileSave() {
    if (this.profileFormGroup.valid) {
      const formValue = this.profileFormGroup.value;
      console.log(formValue)
      // this.authService.updateProfile(formValue).then(() => {
      //   this.authService.userC = { ...this.authService.userC, ...formValue };
      // });
    }
  }
}
