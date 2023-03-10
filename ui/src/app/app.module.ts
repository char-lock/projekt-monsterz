import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { HeaderComponent } from './header/header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { MakeApiRequest } from './services/api-request.service';
import { Logger } from './services/logger.service';
import { CookieService } from 'angular2-cookie';
import { AccountService } from './services/account-service.service';
import { EmailValidate } from './services/email-validation.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    HeaderComponent,
    WelcomePageComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [MakeApiRequest,
         AccountService,
         Logger,
         EmailValidate
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
