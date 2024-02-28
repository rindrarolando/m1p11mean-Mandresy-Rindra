import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const serviceId = params['id']; // Adjust if using a different route param
      this.servicesService.getOneService(serviceId).subscribe((data: any) => {
        this.service = data; // Assuming the data is the service object
      });
    });
  }
}
