import { MessageService } from "primeng/api";

export abstract class BaseCoreAbstract {
    constructor(
        protected messageService: MessageService,
    ) {

    }

    popMessage(message: string, severity: string = 'success', isLoading: boolean = false) {
        if (message.trim().length > 0) {
            this.messageService.add({ severity: isLoading ? 'info' : severity, detail: message, icon: isLoading ? "pi pi-spin pi-spinner" : undefined });
        }
    }
}