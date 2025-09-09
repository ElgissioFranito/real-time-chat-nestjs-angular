import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
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
        ChatRoomComponent
    ]
})
export class DashboardComponent implements AfterViewInit{

  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
  selectedRoom = null;
  user: UserI = this.authService.getLoggedInUser();

  constructor(private chatService: ChatService, private authService: AuthService) { }

  // ngOnInit() {
  //   this.chatService.emitPaginateRooms(10, 0);
  // }

  ngAfterViewInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
