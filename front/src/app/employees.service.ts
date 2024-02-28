import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private baseUrl = 'http://localhost:3000'; // Adjust with your actual API URL

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get(`${this.baseUrl}/employees`);
  }

  getOneEmployee(id: string) {
    return this.http.get(`${this.baseUrl}/employees/${id}`);
  }

  addEmployee(employeeData: any) {
    return this.http.post(`${this.baseUrl}/employees`, employeeData);
  }
  
  addEmployeePofilePics(id: string, employeeData: any) {
    return this.http.put(`${this.baseUrl}/employees/${id}`, employeeData);
  }

  updateEmployee(id: string, employeeData: any) {
    return this.http.put(`${this.baseUrl}/employees/${id}`, employeeData);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }
}
