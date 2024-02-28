import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeTasksService } from '../employee-tasks.service';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.css']
})
export class EmployeeTasksComponent implements OnInit {
  employeeId: string;
  tasks: any[] = [];
  totalCommission: number = 0;
  date: string = new Date().toISOString().split('T')[0]; // Default to today's date

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeTasksService: EmployeeTasksService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.employeeId = params['id']; // Get employee ID from route
      this.fetchTasks();
    });
  }

  fetchTasks(): void {
    this.employeeTasksService.getEmployeeDailyTasks(this.employeeId, this.date)
      .subscribe((data: any) => {
        this.tasks = data.tasks;
        this.totalCommission = data.totalCommission;
      });
  }
}
