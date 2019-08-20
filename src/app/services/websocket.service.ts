import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient: any;
  private socketUri = 'http://localhost:8080/wrw-web-socket';
  private senderEndPoint = '/app/message';
  private recieverEndPoint = '/topic/message';

  private subject = new Subject<any>();

  constructor() { }

  /**
   * Connects websocket service
   */
  connect() {
    const socket = new SockJs(this.socketUri);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      // console.log(frame);
      this.stompClient.subscribe(this.recieverEndPoint, (message) => {
        this.subject.next(message.body); // Forward recieved message to Observable
      });
    });
  }

  /**
   * Disconnects websocket service
   */
  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  /**
   * Sends message to websocket server
   * @param message JSON object to be sent to websocket
   */
  sendMessage(message: {}) {
    this.stompClient.send(this.senderEndPoint, {}, message);
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }


}
