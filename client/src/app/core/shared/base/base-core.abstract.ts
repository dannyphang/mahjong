import { MessageService } from "primeng/api";

export abstract class BaseCoreAbstract {
    constructor(
        protected messageService: MessageService,
    ) {

    }

    popMessage(message: string, severity: string = 'success',) {
        if (message.trim().length > 0) {
            this.messageService.add({ severity: severity, detail: message });
        }
    }
}