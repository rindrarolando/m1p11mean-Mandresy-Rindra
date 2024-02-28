import { Component } from '@angular/core';
import { EmployeeTasksService } from '../employee-tasks.service';

@Component({
  selector: 'app-add-employee-task',
  templateUrl: './add-employee-task.component.html',
  styleUrls: ['./add-employee-task.component.css']
})
export class AddEmployeeTaskComponent {
  taskData = {
    employeeId: '',
    service: {}, // This should be selected from a list of services, assuming you have that setup
    startDateTime: '',
    // Other fields as needed
  };

  constructor(private employeeTasksService: EmployeeTasksService) {}

  addTask(): void {
    this.employeeTasksService.addTask(this.taskData).subscribe(response => {
      console.log('Task added', response);
      // Redirect or show success message
    }, error => {
      console.error('Error adding task', error);
      // Handle error case
    });
  }
}
