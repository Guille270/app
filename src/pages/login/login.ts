import { Component} from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { AdminTasacionesPage } from '../admin-tasaciones/admin-tasaciones';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  storage = window.localStorage;
  email: String;
  password: String;
  token:string

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http) {
  }

  loginRequest() {
    console.log("Email " + this.email)
    console.log("Password " +this.password)

    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');


    var body = "email=" + this.email + "&password=" + this.password;

    this.http.post('http://agontruckcenterzaragoza.com/intranet/api/login',body,
    {
      headers: customHeaders
    
    }).map(res => res.json()).subscribe(
      data => {
        this.storage.setItem("token",data.token)
        console.log(this.storage.getItem("token"))
        this.navCtrl.setRoot(AdminTasacionesPage);
    },
    err => {
      console.log("error");
    }
    );
  }


}
