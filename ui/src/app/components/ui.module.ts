import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { AppRouterModule } from "../router.module";

import { CardComponent } from "./card/card.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FangModalComponent } from "./modal/modal.component";
import { FangModalContentDirective } from "./modal/modal.directive";
import { LoginModal } from "./modal/content/login/login.modal";
import { FangModule } from "../resources/fang-ui/ngx-fang.module";
import { FangToastComponent } from "./toast/toast.component";

@NgModule({
  declarations: [
    CardComponent,
    FangModalComponent,
    NavbarComponent,
    LoginModal,
    FangModalContentDirective,
    FangToastComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    FangModule
  ],
  exports: [
    CardComponent,
    FangModalComponent,
    NavbarComponent,
    LoginModal,
    FangToastComponent
  ]
})
export class UserInterfaceModule {}
