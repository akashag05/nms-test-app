import { Component } from '@angular/core';
import * as EventBus from '@vertx/eventbus-bridge-client.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'test-app';
  message: any;

  eventBus: any;

  ngOnInit() {
    // Create a SockJS instance and connect to the WebSocket server
    this.eventBus = new EventBus('https://localhost:8443/eventbus');

    this.eventBus.onopen = () => {
      this.eventBus.registerHandler(
        'websocket.to.client',
        {},
        (error: Error, message: any) => {
          console.log(message.body);
        }
      );
    };
  }

  clickMe() {
    this.eventBus.send('websocket.to.server', {
      'event.type': 'test',
      query: '{}',
    });
  }
}
