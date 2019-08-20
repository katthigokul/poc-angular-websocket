import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { MessageComponent } from '../message/message.component';
import { PlaceholderDirective } from '../directives/placeholder.directive';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [WebsocketService]
})
export class ChatBoxComponent implements OnInit {

  private recievedMessage: string;
  private userName: string;
  @ViewChild(PlaceholderDirective, { static: false }) messageHost: PlaceholderDirective;

  constructor(private websocketService: WebsocketService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.websocketService.connect();
    this.websocketService.getMessage().subscribe(
      (message) => {
        // Dynamically add message components to message-box
        const messageComponentFacotory = this.componentFactoryResolver.resolveComponentFactory(MessageComponent);
        const messageHostViewContainerRef = this.messageHost.viewContainerRef;
        const messageRef = messageHostViewContainerRef.createComponent(messageComponentFacotory);
        const response = JSON.parse(message);
        messageRef.instance.userName = response.userName;
        messageRef.instance.message = response.message;
      }
    );
  }

  sendMessage(message: string) {
    message = message.trim();
    // Ref https://stackoverflow.com/a/5487027 for use of below condition.
    if (!!message) {
      const response = {
        userName: this.userName,
        message: message
      };
      this.websocketService.sendMessage(JSON.stringify(response));
    }
  }

  setUserName(userName: string) {
    userName = userName.trim();
    if (!!userName) {
      this.userName = userName;
    }
  }
}
