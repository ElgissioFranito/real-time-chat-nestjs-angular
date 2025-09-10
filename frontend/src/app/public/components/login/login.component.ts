
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatService } from 'src/app/private/services/chat-service/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {

  form: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    password: new UntypedFormControl(null, [Validators.required])
  });

  destroyRef = inject(DestroyRef);
  chatService = inject(ChatService);

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (this.form.valid) {
      this.authService.login({
        email: this.email.value,
        password: this.password.value
      }).pipe(
        tap(() => {
          this.router.navigate(['../../private/dashboard']);
          this.chatService.connect();
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
    }
  }

  get email(): UntypedFormControl {
    return this.form.get('email') as UntypedFormControl;
  }

  get password(): UntypedFormControl {
    return this.form.get('password') as UntypedFormControl;
  }

}
