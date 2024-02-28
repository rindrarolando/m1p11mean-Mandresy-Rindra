import { TestBed } from '@angular/core/testing';

import { EmployeeTasksService } from './employee-tasks.service';

describe('EmployeeTasksService', () => {
  let service: EmployeeTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
