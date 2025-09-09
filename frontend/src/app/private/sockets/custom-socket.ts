import { ApplicationRef, Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { tokenGetter } from 'src/app/app.module';

const config: any = {
  url: 'http://localhost:3000', options: {
    extraHeaders: {
      Authorization: tokenGetter()
    }
  }
};

@Injectable({providedIn: 'root'})
export class CustomSocket extends Socket {
  constructor() {
    super(config, inject(ApplicationRef))
  }
}