import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Http,Headers } from '@angular/http';

import { LoginPage } from '../login/login';


import { ActionSheetController } from 'ionic-angular'

import 'rxjs/add/operator/map';

@Component({
  selector: 'admin-files-prueba',
  templateUrl: 'admin-files.html'
})
export class AdminFilesPage implements OnInit {
  localStorage = window.localStorage
  sessionStorage = window.sessionStorage
  server = {
    "baseUrl": "http://agontruckcenterzaragoza.com/intranet/",
    "apiUrl":  "http://agontruckcenterzaragoza.com/intranet/api/"
  }

  uploadModal = {
    "modalId": "uploadModal",
    "btnId": "uploadBtn",
    "spanId": "imgClose",
    "modalElement": HTMLElement = null,
    "btnElement": HTMLElement = null,
    "spanElement": HTMLElement = null

  }

  viewImageModal =  {
    "modalId": "imgModal",
    "spanId": "imgClose",
    "modalElement": HTMLElement = null,
    "spanElement": HTMLElement = null

  }

  selectedTasacion: any
  selectedFile:any
  filenames: any
  fileToUpload =  {
    "archivo":null,
    "type":"",
    "name":""
  }
  newFilename: string


  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public actionSheet: ActionSheetController,public toastController:ToastController) {
  }

  ngOnInit() {
    this.selectedTasacion = JSON.parse(this.sessionStorage.getItem("selectedTasacion"))
    this.getFiles(this.selectedTasacion.id_tasacion,this.selectedTasacion.id_vehiculo)
    this.setUploadModal()
    this.setViewImageModal()
    
  }

  getFiles = (idTasacion,idVehiculo) => new Promise((resolve, reject) => {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    customHeaders.append('Authorization', 'Bearer ' + this.localStorage.getItem('token'))

    this.http.get(this.server.apiUrl + 'explorador',{
      params: {
        "id_tasacion": idTasacion,
        "id_vehiculo": idVehiculo
      },
      headers:customHeaders
    
    }).map(res => res.json()).subscribe(
      data => {
        data.content = this.sanitizeFiles(data.content)
        this.filenames = data.content
        console.log(this.filenames)
        this.localStorage.setItem("token",data.token)
        console.log(this.localStorage.getItem("token"))
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

  sanitizeFiles(files) {
    for (let i=0; i < files.length; i++) {
      if (files[i] == "." || files[i] == "..") {
        files.splice(i,1)
        i--
      }
      console.log(files)
    }
    return files
  }

 buildImgUrl(img) {
    return this.server.baseUrl + 'uploads/' + this.selectedTasacion.id_vehiculo + '/' + this.selectedTasacion.id_tasacion + '/' + img;
};

selectFile = (filename) => {
   
  this.selectedFile =  filename

  let actionSheet = this.actionSheet.create({ //Llamamos a la función create para contruir nuestro componente.
    title: this.selectedFile, //El título de nuestro ActionSheet
    //Este array define los botones que van a ir dentro de nuestro contenedor
    buttons: [
      {
        text: 'Ver',
        handler: () => {
          this.openModal(this.viewImageModal.modalElement)
        }
      },
      {
        text: 'Eliminar Archivo',
        role: 'destructive',
        handler: () => {
          this.deleteFile().then(() => {
            this.getFiles(this.selectedTasacion.id_tasacion,this.selectedTasacion.id_vehiculo)
            this.presentToast("El fichero se ha borrado con exito")
          })
        }
      },
      {
        text: 'Renombrar Archivo',
        handler: () => {
          this.openPrompt("Introduzca el nuevo nombre del archivo sin extension").then((newName) => {
            let extension = this.getExtensionFromFilename(this.selectedFile)
            let newFilename = newName + "." + extension
            this.renameFile(newFilename).then(() =>{
              this.getFiles(this.selectedTasacion.id_tasacion,this.selectedTasacion.id_vehiculo)
              this.presentToast("El archivo ha sido renombrado con exito")
            })
          })
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

getExtensionFromFilename(filename) {
  let extension = filename.split(".")
  if (extension.length != 1) {
    return extension[extension.length - 1]
  } else {
    return ".ext"
  }
  
}


getFileFromInput(filesList) {
  let file = filesList.item(0)
  this.fileToBase64(file).then((response) => {
    this.fileToUpload.archivo = response
    this.fileToUpload.name = file.name
    this.fileToUpload.type = file.type
    console.log(JSON.stringify(this.fileToUpload.archivo))

  })
 
}

fileToBase64 = (fileList) => new Promise((resolve, reject) => {
  var fileReader = new FileReader();
  fileReader.readAsDataURL(fileList);
  fileReader.onload = () => {
    resolve(fileReader.result)
  };
  fileReader.onerror = function (error) {
    console.log('Error: ', error);
  };
})

handleUpload = () => {
  this.uploadFile().then(() => {
    this.presentToast("La subida ha empezado")
    this.getFiles(this.selectedTasacion.id_tasacion,this.selectedTasacion.id_vehiculo)
    this.closeModal(this.uploadModal.modalElement)
    this.presentToast("El fichero se ha subido con exito")
  })
}

uploadFile = () => new Promise((resolve, reject) => {
  let customHeaders = new Headers();
  customHeaders.append('Accept', 'multipart/form-data');
  customHeaders.append('Authorization', 'Bearer ' + this.localStorage.getItem('token'))

  let formData = new FormData()
  formData.append("file", JSON.stringify(this.fileToUpload))
  formData.append("id_tasacion", this.selectedTasacion.id_tasacion)
  formData.append("id_vehiculo", this.selectedTasacion.id_vehiculo)

  this.http.post('http://agontruckcenterzaragoza.com/intranet/api/explorador',formData,{
    headers:customHeaders
  }).map(res => res.json()).subscribe(
    data => {
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



deleteFile = () => new Promise((resolve, reject) => {
  let customHeaders = new Headers();
  customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  customHeaders.append('Authorization', 'Bearer ' + this.localStorage.getItem('token'))

  this.http.delete('http://agontruckcenterzaragoza.com/intranet/api/explorador',{
    headers:customHeaders,
    params: {
      "file": this.selectedFile,
      'id_vehiculo': this.selectedTasacion.id_vehiculo,
      'id_tasacion': this.selectedTasacion.id_tasacion
    }
  }).map(res => res.json()).subscribe(
    data => {
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



renameFile = (newFilename) => new Promise((resolve, reject) => {
  let customHeaders = new Headers();
  customHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  customHeaders.append('Authorization', 'Bearer ' + this.localStorage.getItem('token'))

  var body = "oldName=" + this.selectedFile + "&newName=" + newFilename + "&id_vehiculo=" + this.selectedTasacion.id_vehiculo + "&id_tasacion=" + this.selectedTasacion.id_tasacion

  this.http.put('http://agontruckcenterzaragoza.com/intranet/api/explorador',body,{
    headers:customHeaders
  }).map(res => res.json()).subscribe(
    data => {
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

openPrompt = (title) => new Promise(function (resolve, reject) {      
  var newName = prompt(title, "");
  return resolve(newName);
});

































// When the user clicks the button, open the uploadModal 
openModal= (element:HTMLElement) => {
  try {
    element.style.display = "block";
  } catch (e) {
    console.log(e)
  }     
}

closeModal = (element:HTMLElement) => {
  element.style.display = "none";
}

setUploadModal = () => {
  // Get the modal
  this.uploadModal.modalElement = document.querySelector("#" +  this.uploadModal.modalId)

  // Get the button that opens the modal
  this.uploadModal.btnElement = document.getElementById("#" +  this.uploadModal.btnElement)

  // Get the <span> element that closes the modal
  this.uploadModal.spanElement = document.getElementById("#" +  this.uploadModal.spanElement)
};

setViewImageModal = () => {
  // Get the modal
  this.viewImageModal.modalElement = document.querySelector("#" +  this.viewImageModal.modalId)

  // Get the <span> element that closes the modal
  this.viewImageModal.spanElement = document.getElementById("#" +  this.viewImageModal.spanElement)
};




  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  
}
