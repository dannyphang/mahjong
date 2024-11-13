import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.scss'
})
export class Error404Component {
  constructor(
    private _location: Location,
    private router: Router,
  ) {

  }

  backToPreviousPage() {
    this._location.back();
  }

  goToHomePage() {
    this.router.navigate(["/"]);
  }
}
