import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private _apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getAppointments() {
    return this.http.get(`${this._apiUrl}/appointments`);
  }

  getOneAppointment(appointmentId: string) {
    return this.http.get(`${this._apiUrl}/appointments/${appointmentId}`);
  }

  addAppointment(appointmentData: any) {
    return this.http.post(`${this._apiUrl}/appointments`, appointmentData);
  }

  deleteAppointment(appointmentId: string) {
    return this.http.delete(`${this._apiUrl}/appointments/${appointmentId}`);
  }

  getClientAppointmentHistory(clientId: string, startDateTime: string, endDateTime: string) {
    return this.http.get(`${this._apiUrl}/appointments/client/${clientId}`, { params: { startDateTime, endDateTime } });
  }

  getEmployeeAppointmentHistory(employeeId: string, startDateTime: string, endDateTime: string) {
    return this.http.get(`${this._apiUrl}/appointments/employee/${employeeId}`, { params: { startDateTime, endDateTime } });
  }

  markAppointmentAsDone(appointmentId: string) {
    return this.http.patch(`${this._apiUrl}/appointments/${appointmentId}/done`, {});
  }
}
