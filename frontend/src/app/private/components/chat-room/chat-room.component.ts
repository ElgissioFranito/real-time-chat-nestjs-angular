import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MessagePaginateI } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() chatRoom: RoomI;
  @ViewChild('messages') private messagesScroller: ElementRef;

  authService = inject(AuthService);

  user: UserI = this.authService.getLoggedInUser();

  messagesPaginate$: Observable<MessagePaginateI> = combineLatest([
    this.chatService.getMessages(),
    this.chatService.getAddedMessage().pipe(startWith(null))
  ]).pipe(
    map(([messagePaginate, message]) => {

      if (message && message.room.id === this.chatRoom.id && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      messagePaginate.items = items;
      return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
  )

  chatMessage: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngAfterViewInit() {
    if (this.messagesScroller) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.chatService.sendMessage({ text: this.chatMessage.value, room: this.chatRoom });
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => { this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight }, 1);
    } catch { }

  }

}
