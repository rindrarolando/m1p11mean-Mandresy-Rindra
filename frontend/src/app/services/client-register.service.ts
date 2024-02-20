import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IClient } from '../interfaces/iclient';

@Injectable({
  providedIn: 'root'
})
export class ClientRegisterService {
  private apiUrl = environment.apiUrl + 'auth/register';


  constructor(private http: HttpClient) { }

  register(client: IClient) {
    return this.http.post<IClient>(this.apiUrl , client, { observe: 'response' });
  }

}
