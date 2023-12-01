import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//const AUTH_API = 'http://localhost:3005/';
const AUTH_API = 'https://blackdiamond.ddns.net:3005/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  registerRol(username: string, email: string, password: string, roles:string[]): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      roles
    }, httpOptions);
  }

  updatePhoto(userId: string, photo: string): Observable<any> {
    return this.http.put(AUTH_API + 'photo', {
      userId,
      photo
    }, httpOptions);
  }

  addEvent(client: string, title: string, date: string, period: string, workers: string[]): Observable<any> {
    return this.http.post(AUTH_API + 'newEvent', {
      client,
      date,
      period,
      title, 
      workers
    }, httpOptions);
  }  
}