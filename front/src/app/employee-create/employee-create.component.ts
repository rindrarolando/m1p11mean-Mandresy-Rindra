import { Component } from '@angular/core';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent {
  employee = {
    firstName: '',
    lastName: '',
    // Add other employee fields
  };

  constructor(private employeesService: EmployeesService) {}

  createEmployee(): void {
    this.employeesService.addEmployee(this.employee).subscribe(response => {
      console.log('Employee created', response);
      // Redirect or show success message
    }, error => {
      console.error('Error creating employee', error);
      // Handle error case
    });
  }
}
