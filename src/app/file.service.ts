import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  server_url = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  upload(formData: FormData) : Observable<HttpEvent<string[]>>{
    return this.http.post<string[]>(`${this.server_url}/file/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  download(fileName: string) : Observable<HttpEvent<Blob>>{
    return this.http.get(`${this.server_url}/file/download/${fileName}`, {
      observe: 'events',
      reportProgress: true,
      responseType: 'blob'
    });
  }
}
