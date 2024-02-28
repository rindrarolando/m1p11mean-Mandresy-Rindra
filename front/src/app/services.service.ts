import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private _apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getServices() {
    return this.http.get(`${this._apiUrl}/services`);
  }

  getOneService(id: string) {
    return this.http.get(`${this._apiUrl}/services/${id}`);
  }

  addService(serviceData: any) {
    return this.http.post(`${this._apiUrl}/services`, serviceData);
  }

  updateService(id: string, serviceData: any) {
    return this.http.put(`${this._apiUrl}/services/${id}`, serviceData);
  }

  deleteService(id: string) {
    return this.http.delete(`${this._apiUrl}/services/${id}`);
  }
}
