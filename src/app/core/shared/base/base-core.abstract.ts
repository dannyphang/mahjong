import { MessageService } from "primeng/api";

export abstract class BaseCoreAbstract {
    constructor(
        protected messageService: MessageService,
    ) {

    }

    popMessage(message: string, title: string = 'success', severity: string = 'success',) {
        this.messageService.add({ severity: severity, summary: title, detail: message });
    }
}