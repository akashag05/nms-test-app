import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Stomp, Client, Message } from '@stomp/stompjs';
// import overWS from 'stompjs';
@NgModule({
  providers: [],
  declarations: [],
  exports: [],
})
export class ChatAppServiceModule {
  private listener: Subject<any> = new Subject<any>();
  private socket: { client: WebSocket | null; stomp: Client | null } = {
    client: null,
    stomp: null,
  };
  private messageIds: any = {};

  RECONNECT_TIMEOUT = 30000;
  SOCKET_URL = 'https://localhost:8443/eventbus';
  CHAT_TOPIC = 'websocket.to.server';
  CHAT_BROKER = 'websocket.to.client';

  receive(): Observable<any> {
    return this.listener.asObservable();
  }

  send(message: string): void {
    const id = { id: 123, msg: 'hello' };
    this.socket.stomp!.publish({
      destination: this.CHAT_BROKER,
      // headers: { priority: 9 },
      body: JSON.stringify({ message, id }),
    });
    this.messageIds.push(id);
  }

  private reconnect(): void {
    setTimeout(() => {
      this.initialize();
    }, this.RECONNECT_TIMEOUT);
  }

  private getMessage(data: Message): any {
    const message = JSON.parse(data.body);
    const out: any = {
      message: message.message,
      time: new Date(message.time),
    };
    if (this.messageIds.includes(message.id)) {
      out.self = true;
      this.messageIds = this.messageIds.filter((id: any) => id !== message.id);
    }
    return out;
  }

  private startListener(): void {
    this.socket.stomp!.subscribe(this.CHAT_TOPIC, (data: Message) => {
      this.listener.next(this.getMessage(data));
    });
  }

  private initialize(): void {
    this.socket.client = new WebSocket(this.SOCKET_URL);
    this.socket.stomp!.webSocketFactory = () => this.socket.client as any; // Assert 'client' to be of type 'WebSocket'
    this.socket.stomp!.onConnect = () => {
      this.startListener();
    };
    this.socket.stomp!.onStompError = () => {
      this.reconnect();
    };
    this.socket.stomp!.activate();
  }

  constructor() {
    this.initialize();
  }
}
