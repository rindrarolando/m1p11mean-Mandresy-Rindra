import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTasksComponent } from './employee-tasks.component';

describe('EmployeeTasksComponent', () => {
  let component: EmployeeTasksComponent;
  let fixture: ComponentFixture<EmployeeTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
