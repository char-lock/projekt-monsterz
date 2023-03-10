import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { HeaderComponent } from './header/header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

import { FormsModule } from '@angular/forms';
import { Logger } from './services/logger.service';
import { CookieService } from 'angular2-cookie';
import { AccountService } from './services/account-service.service';
import { EmailValidate } from './services/email-validation.service';
import { CreateUserService } from './services/create-user-service.service';
import { CookieController } from './services/cookie.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    HeaderComponent,
    WelcomePageComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [CreateUserService,
         AccountService,
         Logger,
         EmailValidate,
         CookieController
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
