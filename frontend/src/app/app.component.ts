import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, TestService } from './services/test-service/test.service';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './private/services/chat-service/chat.service';
import { tokenGetter } from './helpers/tokenHelper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'frontend';
  chatService = inject(ChatService);

  testValue: Observable<Test> = this.service.getTest();

  constructor(private service: TestService) { }

  ngOnInit() {
    const token = tokenGetter();
    if (token) {
      this.chatService.connect();
    }
  }
}
