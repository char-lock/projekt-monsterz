import { Component, Input } from "@angular/core";
import { NavLink } from "../../../app/types/other.types";

@Component({
  selector: "pm-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent {

  @Input() routes: NavLink[] = [];

}
