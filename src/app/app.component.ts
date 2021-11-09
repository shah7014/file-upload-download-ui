import {Component} from '@angular/core';
import {FileService} from "./file.service";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private fileService: FileService) {
  }

  fileNames: string[] = [];
  fileStatus = {status: '', requestType: '', percentage: 0};

  onUploadFiles(files: File[]) {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name);
    }
    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      }, error => {
        console.log(error);
      }
    );
  }

  onDownloadFile(fileName: string) {
    this.fileService.download(fileName).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      }, error => {
        console.log(error);
      }
    );
  }

  private reportProgress(event: HttpEvent<string[] | Blob>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.uploadStats(event.loaded, event.total, 'Uploading');
        break;
      case HttpEventType.DownloadProgress:
        this.uploadStats(event.loaded, event.total, 'Downloading');
        break;
      case HttpEventType.ResponseHeader:
        console.log('headers:- ', event);
        break;
      case HttpEventType.Response:
        if (event.body instanceof Array) {
          // uploaded file names list
          for (let fileName of event.body) {
            this.fileNames.unshift(fileName);
          }
        } else {
          //download logic we will get a blob
          saveAs(event.body, event.headers.get('filename'));
        }
    }
  }

  uploadStats(loaded: number, total, type: string) {
    this.fileStatus.percentage = Math.round(100 * (loaded / total));
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = type;
  }
}
