import { Component, Input } from '@angular/core';
import { TerminalService } from 'primeng/terminal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {
  @Input() prompt: string = '>';
  @Input() welcomeMessage: string = 'New Terminal';

  subscription: Subscription;

  constructor(private terminalService: TerminalService) {
    this.subscription = this.terminalService.commandHandler.subscribe((command) => {
      let response = command === 'date' ? new Date().toDateString() : 'Unknown command: ' + command;
      this.terminalService.sendResponse(response);
    });
  }
}
