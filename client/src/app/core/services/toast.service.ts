import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
    ) { }

    addSingle(toastConfig: MessageModel, delayAfterClearMs: number = 0) {
        // Optionally delay before adding
        if (delayAfterClearMs > 0) {
            setTimeout(() => this.addSingleInternal(toastConfig), delayAfterClearMs);
        } else {
            this.addSingleInternal(toastConfig);
        }
    }

    private addSingleInternal(toastConfig: MessageModel) {
        // Set default values for severity and icon
        switch (toastConfig.severity) {
            case 'success':
            case undefined:
                toastConfig.severity = 'success';
                toastConfig.icon = 'pi pi-check';
                break;
            case 'error':
                toastConfig.icon = 'pi pi-times-circle';
                break;
            case 'info':
                toastConfig.icon = 'pi pi-info-circle';
                break;
            case 'warn':
                toastConfig.icon = 'pi pi-exclamation-triangle';
                break;
        }

        // Ensure toastConfig.messageData is always defined
        const messageData = toastConfig.messageData || [];

        this.messageService.add({
            severity: toastConfig.severity,
            detail:
                typeof toastConfig.message === 'string'
                    ? this.translateService.instant(
                        toastConfig.message,
                        this.loadMessageData(messageData).reduce((acc, cur) => {
                            acc[cur.label] = this.translateService.instant(cur.value);
                            return acc;
                        }, {})
                    ) || toastConfig.message
                    : '',
            key: toastConfig.key,
            sticky: toastConfig.isLoading || toastConfig.sticky,
            icon: toastConfig.isLoading ? 'pi pi-spin pi-spinner' : toastConfig.icon,
        });
    }

    private loadMessageData(data: any[]) {
        return data.map((i) => {
            return {
                label: this.translateService.instant(i.key),
                value: i.value,
            };
        });
    }

    addMultiple(toastConfig: MessageModel[]) {
        this.messageService.addAll(
            toastConfig.map((i) => {
                switch (i.severity) {
                    case 'success':
                    case undefined:
                        i.severity = 'success';
                        i.icon = 'pi pi-check'
                        break;
                    case 'error':
                        i.icon = 'pi pi-times-circle';
                        break;
                    case 'info':
                        i.icon = 'pi pi-info-circle';
                        break;
                }
                return {
                    severity: i.severity,
                    detail: this.translateService.instant(i.message),
                    key: i.key,
                    sticky: i.isLoading || i.sticky,
                    icon: i.isLoading ? "pi pi-spin pi-spinner" : undefined,
                };
            }),
        );
    }

    clear(key: string) {
        this.messageService.clear(key)
        // if (key) {
        //     if (typeof key === 'string') {
        //         this.messageService.clear(key);
        //     }
        // }
        // else {
        //     this.messageService.clear()
        // }
    }
}

export class MessageModel {
    message: string;
    severity?: 'success' | 'info' | 'error' | 'warn';
    key: string;
    icon?: string;
    isLoading?: boolean;
    messageData?: any[];
    sticky?: boolean;
}