import { Component} from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { AdminTasacionesPage } from '../admin-tasaciones/admin-tasaciones';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  localStorage = window.localStorage;
  email: String;
  password: String;
  token:string
  rememberCredentials:boolean

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http) {
  }

  ngOnInit() {
    
    if (this.localStorage.getItem("credentials") != null && this.localStorage.getItem("credentials") != undefined && this.localStorage.getItem("credentials") != "") {
      let credentials = JSON.parse(this.localStorage.getItem("credentials"))
      this.email = credentials.email
      this.password = credentials.password
      this.rememberCredentials = true;
    } else {
      this.rememberCredentials = false;
    }
  }

  loginRequest() {

    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');


    var body = "email=" + this.email + "&password=" + this.password;

    this.http.post('http://agontruckcenterzaragoza.com/intranet/api/login',body,
    {
      headers: customHeaders
    
    }).map(res => res.json()).subscribe(
      data => {
        this.localStorage.setItem("token",data.token)
        console.log(this.localStorage.getItem("token"))
        this.navCtrl.setRoot(AdminTasacionesPage);
    },
    err => {
      console.log("error");
    }
    );
  }

  updateRememberCredentialsOptions() {
    console.log(this.rememberCredentials)
    if (this.rememberCredentials) {
      let credentials = {"email":this.email,"password":this.password}
      this.localStorage.setItem("credentials",JSON.stringify(credentials))
    } else {
      this.localStorage.removeItem("credentials","")
    }
  }


}
