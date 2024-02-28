import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTasksService {
  private _apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getEmployeeDailyTasks(employeeId: string, date: string) {
    return this.http.get(`${this._apiUrl}/employeeTasks/${employeeId}/daily`, { params: { date } });
  }

  addTask(taskData: any) {
    return this.http.post(`${this._apiUrl}/employeeTasks`, taskData);
  }
}
