import { CommonModule, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
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
  router = inject(Router);

  constructor(private chatService: ChatService, private authService: AuthService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.chatService.emitPaginateRooms(10, 0);
    this.rooms$.pipe(
      tap((rooms: RoomPaginateI) => {
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


  // logout
  logout() {
    this.authService.logout().pipe(
      tap(() => {

        localStorage.removeItem('nestjs_chat_app');

        this.snackbar.open('Logout Successfull', 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
        });

        this.chatService.disconnect();

        this.router.navigate(['../login']);
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
  }

}
