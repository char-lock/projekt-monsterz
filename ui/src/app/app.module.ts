import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { HeaderComponent } from './header/header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { Accounts } from './services/accounts.service';
import { MakeApiRequest } from './services/make-register-api-call.service';

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
         Accounts
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
