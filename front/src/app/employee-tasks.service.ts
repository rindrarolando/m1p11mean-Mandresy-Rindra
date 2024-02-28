import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTasksService {
  private baseUrl = 'http://localhost:3000'; // Adjust with your actual API URL

  constructor(private http: HttpClient) { }

  getEmployeeDailyTasks(employeeId: string, date: string) {
    return this.http.get(`${this.baseUrl}/employeeTasks/${employeeId}/daily`, { params: { date } });
  }

  addTask(taskData: any) {
    return this.http.post(`${this.baseUrl}/employeeTasks`, taskData);
  }
}
