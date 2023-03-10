import { Injectable } from "@angular/core";

@Injectable()
export class EmailValidate {

     ValidateEmail(inputText: string) {
	var mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	if(inputText.match(mailformat))
	{
		alert("This is not a valid email address");
		return false;
     }
     return true;

}
}
