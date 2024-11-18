import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  helpDialogVisible: boolean = false;

  @HostListener("window:keydown", ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "?") {
      this.helpDialogVisible = !this.helpDialogVisible;
    }
  }
}
