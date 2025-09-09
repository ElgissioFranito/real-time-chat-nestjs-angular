
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule
  ]
})
export class SelectUsersComponent implements OnInit {

  @Input() users: UserI[] = [];
  @Output() addUser: EventEmitter<UserI> = new EventEmitter<UserI>();
  @Output() removeuser: EventEmitter<UserI> = new EventEmitter<UserI>();

  searchUsername = new UntypedFormControl();
  filteredUsers: UserI[] = [];
  selectedUser: UserI = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.searchUsername.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((username: string) => this.userService.findByUsername(username).pipe(
        tap((users: UserI[]) => this.filteredUsers = users)
      ))
    ).subscribe();
  }

  addUserToForm() {
    this.addUser.emit(this.selectedUser);
    this.filteredUsers = [];
    this.selectedUser = null;
    this.searchUsername.setValue(null);
  }

  removeUserFromForm(user: UserI) {
    this.removeuser.emit(user);
  }

  setSelectedUser(user: UserI) {
    this.selectedUser = user;
  }

  displayFn(user: UserI) {
    if (user) {
      return user.username;
    } else {
      return '';
    }
  }

}
