import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services: any[] = [];

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.servicesService.getServices().subscribe((data: any) => {
      this.services = data; // Assuming the data is an array of services
    });
  }
}

