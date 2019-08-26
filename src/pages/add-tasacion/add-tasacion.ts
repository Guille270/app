import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Http,Headers } from '@angular/http';

import { LoginPage } from '../login/login';
import { AdminTasacionesPage } from '../admin-tasaciones/admin-tasaciones';


import 'rxjs/add/operator/map';

@Component({
  selector: 'add-tasacion',
  templateUrl: 'add-tasacion.html'
})
export class AddTasacionPage implements OnInit{
  storage = window.localStorage;
  ruedas = [{
    id: 1,
    desc: "0%-30%"
},
{
    id: 2,
    desc: "31%-60%"
                        },
{
    id: 3,
    desc: "61%-100%"
                       }]
  marcas = []
  tipos = []
  cabinas = []
  configuraciones = []
  demeritos = []
  demeritoTemporal = {"nombre":"","valor":0}
  tasacion = {
    "carroceria": "Blanca",
    "demeritos": [],
    "fecha_tasacion": this.formatDate(),
    "fecha_matriculacion": "11/10/10",
    "hidraulico": "1200",
    "id_cabina": "6",
    "id_configuracion": "1",
    "id_marca": "3",
    "id_tipo": "3",
    "km": "234",
    "matricula": "12345",
    "modelo": "Grande",
    "nombre_marca": "",
    "potencia": "134",
    "pretasacion": "12000",
    "ruedas_delanteras": "1",
    "ruedas_traseras": "1",
    "tasacionTotal": "3000"
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http,public toastController:ToastController) {
  }

  ngOnInit() {
    let defaultTab = {"id":"vehiculoTab", "name":"vehiculo"}
    this.openTab(defaultTab.id,defaultTab.name)
    
    this.getDropdowns()        
  }

  getDropdowns = () => {
    this.getMarcas().then(() => {
      this.getTipos().then(() => {
        this.getCabinas().then(() => {
          this.getConfiguraciones().then(() => {
            this.getDemeritos().then(() => {
            })
          })
        })
      })
    })
  }


  show() {
    console.log(this.tasacion)
  }

  assignDemeritoTemporal($event) {
    this.demeritoTemporal.nombre = $event.target.options[$event.target.options.selectedIndex].text;
    this.demeritoTemporal.valor = $event.target.options[$event.target.options.selectedIndex].value;
  }
  

  newDemerito() {
    this.tasacion.demeritos.push(Object.assign({},this.demeritoTemporal))
  }

  /*Desplegables*/
  getMarcas = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.storage.getItem('token'))

    this.http.get('http://agontruckcenterzaragoza.com/intranet/api/marcas',{
      headers:customHeaders
    }).map(res => res.json()).subscribe(
      data => {
        this.marcas = data.marcas
        console.log(this.marcas)
        this.storage.setItem("token",data.token)
        console.log(this.storage.getItem("token"))
        resolve("Ok")
    },
    err => {
      console.log("error");

      if (err.status == 401 || err.status == 403) {
        this.storage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });

  getTipos = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.storage.getItem('token'))

    this.http.get('http://agontruckcenterzaragoza.com/intranet/api/tipos',{
      headers:customHeaders
    }).map(res => res.json()).subscribe(
      data => {
        this.tipos = data.tipos
        console.log(this.tipos)
        this.storage.setItem("token",data.token)
        console.log(this.storage.getItem("token"))
        resolve("Ok")
    },
    err => {
      console.log("error");

      if (err.status == 401 || err.status == 403) {
        this.storage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });

  getCabinas = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.storage.getItem('token'))

    this.http.get('http://agontruckcenterzaragoza.com/intranet/api/cabinas',{
      headers:customHeaders
    }).map(res => res.json()).subscribe(
      data => {
        this.cabinas = data.cabinas
        console.log(this.cabinas)
        this.storage.setItem("token",data.token)
        console.log(this.storage.getItem("token"))
        resolve("Ok")
    },
    err => {
      console.log("error");

      if (err.status == 401 || err.status == 403) {
        this.storage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });

  getConfiguraciones = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.storage.getItem('token'))

    this.http.get('http://agontruckcenterzaragoza.com/intranet/api/configuraciones',{
      headers:customHeaders
    }).map(res => res.json()).subscribe(
      data => {
        this.configuraciones = data.configuraciones
        console.log(this.configuraciones)
        this.storage.setItem("token",data.token)
        console.log(this.storage.getItem("token"))
        resolve("Ok")
    },
    err => {
      console.log("error");

      if (err.status == 401 || err.status == 403) {
        this.storage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });

  getDemeritos = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.storage.getItem('token'))

    this.http.get('http://agontruckcenterzaragoza.com/intranet/api/demeritos',{
      headers:customHeaders
    }).map(res => res.json()).subscribe(
      data => {
        this.demeritos = data.demeritos
        this.demeritoTemporal.nombre = this.demeritos[0].nombre
        this.demeritoTemporal.valor = this.demeritos[0].valor
        this.storage.setItem("token",data.token)
       
        resolve("Ok")
    },
    err => {
      console.log("error");

      if (err.status == 401 || err.status == 403) {
        this.storage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });


  uploadTasacion = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.storage.getItem('token'))

    var body = "tasacion=" + JSON.stringify(this.tasacion);
    

    this.http.post('http://agontruckcenterzaragoza.com/intranet/api/tasaciones',body,{
      headers:customHeaders
    }).map(res => res.json()).subscribe(
      data => {
        this.storage.setItem("token",data.token)
        console.log(this.storage.getItem("token"))
        this.navCtrl.setRoot(AdminTasacionesPage);
        this.presentToast("La tasación ha sido creada con exito")
        resolve("Ok")
    },
    err => {
      console.log(err);

      if (err.status == 401 || err.status == 403) {
        this.storage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });

  



  /*TABS*/
openTab(id, tabName) {
  console.log(id)
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    document.getElementById(id).className += " active";
}

async presentToast(msg:string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}


}
