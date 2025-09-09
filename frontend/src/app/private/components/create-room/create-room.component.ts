
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserI } from 'src/app/model/user.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { SelectUsersComponent } from '../select-users/select-users.component';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    SelectUsersComponent
  ]
})
export class CreateRoomComponent {

  form: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(null, [Validators.required]),
    description: new UntypedFormControl(null),
    users: new UntypedFormArray([], [Validators.required])
  });

  constructor(private chatService: ChatService, private router: Router, private activatedRoute: ActivatedRoute) { }

  create() {
    console.log(this.form.getRawValue());
    
    if (this.form.valid) {
      this.chatService.createRoom(this.form.getRawValue());
      this.router.navigate(['../dashboard'], { relativeTo: this.activatedRoute });
    }
  }

  initUser(user: UserI) {
    return new UntypedFormControl({
      id: user.id,
      username: user.username,
      email: user.email
    });
  }

  addUser(userFormControl: UntypedFormControl) {
    this.users.push(userFormControl);
  }

  removeUser(userId: number) {
    this.users.removeAt(this.users.value.findIndex((user: UserI) => user.id === userId));
  }

  get name(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl;
  }

  get description(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl;
  }

  get users(): UntypedFormArray {
    return this.form.get('users') as UntypedFormArray;
  }

}
