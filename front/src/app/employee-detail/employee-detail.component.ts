import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit { // Fixed here
  employee: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const employeeId = params['id'];
      this.employeesService.getOneEmployee(employeeId).subscribe((data: any) => {
        this.employee = data;
      });
    });
  }
}
