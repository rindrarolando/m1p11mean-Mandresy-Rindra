import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(private appointmentsService: AppointmentsService) {}

  ngOnInit(): void {
    this.appointmentsService.getAppointments().subscribe((data: any) => {
      this.appointments = data;
    });
  }

  deleteAppointment(appointmentId: string): void {
    this.appointmentsService.deleteAppointment(appointmentId).subscribe(() => {
      // Refresh the list or handle UI update
      this.appointments = this.appointments.filter(appointment => appointment._id !== appointmentId);
    });
  }
}
