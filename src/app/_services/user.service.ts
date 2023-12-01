import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://blackdiamond.ddns.net:3005/';
//const API_URL = 'http://192.168.171.109:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  executeCommand(command: string): Observable<any> {
    return this.http.post(API_URL + 'command', { command }, {responseType: 'text'});
  }

  getStatus(): Observable<any> {
    return this.http.get(API_URL + 'status', {responseType: 'json'});
  }

  getMods(): Observable<any> {
    return this.http.get(API_URL + 'listMods', {responseType: 'json'});
  }

  onDownload(fileName: string): Observable<any> {
    const options = {
      responseType: 'blob' as 'json', // Indicar que esperamos un Blob
      observe: 'response' as 'body'  // Para acceder a la respuesta completa
    };

    return this.http.post(API_URL + 'download', { fileName }, options);
  }

  delete(fileName: any): Observable<any> {
    return this.http.post(API_URL + 'delete', { fileName });
  }

  startServer(): Observable<any> {
    return this.http.post(API_URL + 'start', {});
  }

  stopServer(): Observable<any> {
    return this.http.post(API_URL + 'stop', {});
  }
}