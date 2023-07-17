import { NgModule } from '@angular/core';
import { ChatAppServiceModule } from './chat-app.service';
@NgModule({
  declarations: [],
  exports: [],
})
export class ChatAppControllerModule {
  messages: string[] = [];
  message: string = '';
  max: number = 140;

  constructor(private chatService: ChatAppServiceModule) {}

  addMessage() {
    this.chatService.send(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.chatService.receive().subscribe(
      (message: any) => {
        this.messages.push(message);
      },
      (error: any) => {
        // Handle error
      }
    );
  }
}
