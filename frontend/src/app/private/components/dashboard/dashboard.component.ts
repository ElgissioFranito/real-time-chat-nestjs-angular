import { CommonModule, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule,
    ChatRoomComponent,
    NgIf
  ]
})
export class DashboardComponent implements OnInit {

  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
  room = signal<RoomPaginateI>({ items: [], meta: null });
  selectedRoom = null;
  user: UserI = this.authService.getLoggedInUser();
  destroyRef = inject(DestroyRef);

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    console.log("onInit dashboard");

    this.chatService.emitPaginateRooms(10, 0);
    this.rooms$.pipe(
      tap((rooms: RoomPaginateI) => {
        console.log("subscribed to rooms");
        this.room.set(rooms);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
