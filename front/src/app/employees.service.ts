import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get(`${this._apiUrl}/employees`);
  }

  getOneEmployee(id: string) {
    return this.http.get(`${this._apiUrl}/employees/${id}`);
  }

  addEmployee(employeeData: any) {
    return this.http.post(`${this._apiUrl}/employees`, employeeData);
  }
  
  addEmployeePofilePics(id: string, employeeData: any) {
    return this.http.put(`${this._apiUrl}/employees/${id}`, employeeData);
  }

  updateEmployee(id: string, employeeData: any) {
    return this.http.put(`${this._apiUrl}/employees/${id}`, employeeData);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this._apiUrl}/employees/${id}`);
  }
}
