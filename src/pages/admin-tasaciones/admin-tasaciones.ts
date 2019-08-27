import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Http,Headers } from '@angular/http';

import { LoginPage } from '../login/login';
import { AddTasacionPage } from '../add-tasacion/add-tasacion';
import { UpdateTasacionPage } from '../update-tasacion/update-tasacion';

import { AdminFilesPage } from '../admin-files/admin-files';

import { ActionSheetController } from 'ionic-angular'

import 'rxjs/add/operator/map';

@Component({
  selector: 'admin-tasaciones-prueba',
  templateUrl: 'admin-tasaciones.html'
})
export class AdminTasacionesPage implements OnInit {
  localStorage = window.localStorage;
  sessionStorage = window.sessionStorage;
  selectedTasacion: any
  tasaciones: any
  availablePages: any
  pagina=1
  resultados=10

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public actionSheet: ActionSheetController,public toastController:ToastController) {
  }

  ngOnInit() {
    this.getTasacionesPaginated(this.pagina, this.resultados)
  }

  setPageAndGetTasaciones(page) {
    this.pagina = page
    this.getTasacionesPaginated(this.pagina,this.resultados)
  }

  getTasacionesPaginated = (pagina,resultados) => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.localStorage.getItem('token'))

    this.http.get('http://agontruckcenterzaragoza.com/intranet/api/tasaciones',{
      params: {
        "pagina": pagina,
        "resultados": resultados
      },
      headers:customHeaders
    
    }).map(res => res.json()).subscribe(
      data => {
        this.tasaciones = this.convertAllDates(data.tasaciones)
        this.availablePages = Array.from({length: data.paginas}, (v, k) => k+1); 
        console.log(this.tasaciones)
        this.localStorage.setItem("token",data.token)
        console.log(this.localStorage.getItem("token"))
        resolve(data)
    },
    err => {
      console.log("GetTasacionesPaginated");
      console.log(err)

      if (err.status == 401 || err.status == 403) {
        this.localStorage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });

  goToAddTasacion() {
    console.log("goToAddTasacion")
    this.navCtrl.setRoot(AddTasacionPage);
  }

  selectTasacion = (index) => {
   
    this.selectedTasacion =  this.tasaciones[index]
    this.sessionStorage.setItem('selectedTasacion', JSON.stringify(this.tasaciones[index]))

    let actionSheet = this.actionSheet.create({ //Llamamos a la función create para contruir nuestro componente.
      title: this.selectedTasacion.matricula, //El título de nuestro ActionSheet
      //Este array define los botones que van a ir dentro de nuestro contenedor
      buttons: [
        {
          text: 'Eliminar Tasación',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.deleteTasacion().then(() => {
              this.getTasacionesPaginated(this.pagina,this.resultados)
            })
          }
        },
        {
          text: 'Modificar Tasación',
          handler: () => {
            this.navCtrl.setRoot(UpdateTasacionPage);
          }
        },
        {
          text: 'Administrar imagenes',
          handler: () => {
            this.navCtrl.setRoot(AdminFilesPage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present(); //Esta es la función que llama al ActionSheet para que sea mostrado.
  }

  deleteTasacion = () => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.localStorage.getItem('token'))

    console.log(this.selectedTasacion.id_tasacion)

    

    this.http.delete('http://agontruckcenterzaragoza.com/intranet/api/tasaciones',{
      headers:customHeaders,
      params: {
        "idTasacion":this.selectedTasacion.id_tasacion
      }
    }).map(res => res.json()).subscribe(
      data => {
        this.presentToast("La tasación ha sido borrada con exito")
        this.localStorage.setItem("token",data.token)
        console.log(this.localStorage.getItem("token"))
        
        resolve("Ok")
    },
    err => {
      console.log(err);

      if (err.status == 401 || err.status == 403) {
        this.localStorage.setItem("token","")
        this.navCtrl.setRoot(LoginPage);
      }
    }
    );
  });


  convertAllDates = function (tasaciones) {
    for (var tasacion of tasaciones) {

        let dates = ["fecha_matriculacion", "fecha"]
        tasacion[dates[0] + "_europea"] = ""
        tasacion[dates[1] + "_europea"] = ""

        for (let i = 0; i < dates.length; i++) {
            if (tasacion[dates[i]] != null && tasacion[dates[i]] != undefined && tasacion[dates[i]] != "0000-00-00" && tasacion[dates[i]].length === 10) {
                var year = tasacion[dates[i]].split("-")[0];
                var month = tasacion[dates[i]].split("-")[1];
                var day = tasacion[dates[i]].split("-")[2];

                tasacion[dates[i] + "_europea"] = day + "-" + month + "-" + year;
            } else {
                tasacion[dates[i] + "_europea"] = "---";
                tasacion[dates[i]] = null;
            }
        }
    }
    return tasaciones;
};


  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  
}
