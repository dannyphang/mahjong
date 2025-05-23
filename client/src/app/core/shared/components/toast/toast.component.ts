import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  messageGroups: { [key: string]: Message[] } = {};

  constructor(
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    // Prevent duplicate subscriptions
    this.messageService.messageObserver.subscribe(
      (value: Message | Message[]) => {
        if (Array.isArray(value)) {
          value.forEach((message) => this.groupMessageByKey(message));
        } else {
          this.groupMessageByKey(value);
        }
      }
    );
  }

  private groupMessageByKey(message: Message) {
    const key = message.key || 'defaultKey';

    // Initialize group if it does not exist
    if (!this.messageGroups[key]) {
      this.messageGroups[key] = [];
    }

    this.messageGroups[key].push(message);
  }

  // Helper function to get object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
