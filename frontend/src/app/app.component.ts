import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, TestService } from './services/test-service/test.service';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'frontend';

  testValue: Observable<Test> = this.service.getTest();

  constructor(private service: TestService) {}
}
