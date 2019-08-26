import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

const URL = 'http://localhost:8080/arquivo/';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    console.log('this.fileData', this.fileData)
    this.convertFile();
  }
 
  convertFile() { 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      console.log('reader', reader)
      this.previewUrl = reader.result; 
      console.log('_event', _event)
      console.log('this.previewUrl', this.previewUrl)
    }
  }
 
  onSubmit() {
    const formData = {
      cooperativa: "23424234",
      associado: "0987654394",
      produto:"HOMOLOGACAOCOBRANCA",
      tipoArquivo: "CNAB400",
      nomeArquivo:this.fileData.name,
      arquivoBase64: this.previewUrl,
      status:"A processar"
    };
    
    console.log('formData', formData)
    this.fileUploadProgress = '0%';
 
    this.http.post(URL, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    })
    .subscribe(events => {
      if(events.type === HttpEventType.UploadProgress) {
        this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        console.log(this.fileUploadProgress);
      } else if(events.type === HttpEventType.Response) {
        this.fileUploadProgress = '';
        console.log(events.body);          
        alert('Arquivo enviado com sucesso!!!!');
      }
         
    }) 
  }
}
