import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  getMeetings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/meetings`);
  }

  postMeeting(meeting): Observable<any> {
    return this.http.post(`${this.baseUrl}/meetings`, meeting);
  }

  putMeeting(meeting): Observable<any> {
    return this.http.put(`${this.baseUrl}/meetings/${meeting.id}`, meeting);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }
}