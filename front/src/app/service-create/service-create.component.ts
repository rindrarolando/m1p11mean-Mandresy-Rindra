import { Component } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css']
})
export class ServiceCreateComponent {
  service = {
    name: '',
    description: ''
    // Add other fields as necessary
  };

  constructor(private servicesService: ServicesService) {}

  createService(): void {
    this.servicesService.addService(this.service).subscribe(response => {
      console.log('Service created', response);
      // Redirect to service list or show success message
    }, error => {
      console.error('There was an error creating the service', error);
      // Handle error case
    });
  }
}
