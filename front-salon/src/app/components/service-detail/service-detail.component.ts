import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ServicesService } from '../services/services.service'; // Assume you have a service to fetch service details

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: any;

  constructor(
    private route: ActivatedRoute,
    // private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    // this.service = this.servicesService.getServiceById(serviceId); // Implement this method in your service
  }

  bookService(serviceId: string): void {
    // Booking logic here
  }
}
