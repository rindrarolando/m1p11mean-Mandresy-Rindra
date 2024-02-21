import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GridImagesModule } from '../../../pages/application/example-crud/components/grid-images/grid-images.module';
import { PaginationModule } from '../../../pages/application/example-crud/components/pagination/pagination.module';
import { SearchBarModule } from '../../../pages/application/example-crud/components/search-bar/search-bar.module';
import { SearchResultModule } from '../../../pages/application/example-crud/components/search-result/search-result.module';
import { ServicesService } from '../../../services/services.service';
import { IPageRequest } from '../../../interfaces/IPageRequest';


@Component({
  selector: 'app-movies-images',
  standalone: true,
  imports: [
    CommonModule,
    GridImagesModule,
    PaginationModule,
    SearchBarModule,
    SearchResultModule,
    RouterModule
  ],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {


  loaded: any;
  items: any;
  columns: any;
  link: any;
  pageRequest: IPageRequest = {pageNumber: 1, rowsPerPage: 8};
  servicesRes: any;

  changePage(pageNb: number) {
    this.pageRequest.pageNumber = pageNb

    // fetch the list of the services
    this.serviceService.fetchAllServices(this.pageRequest).subscribe({
      next: ({ services }) => {
        this.servicesRes = services
      },
      error: (err) => {
        console.log(err);

      }
    })

  }

  ngOnInit(): void {
    this.initialize()

    // fetch the list of the services
    this.serviceService.fetchAllServices(this.pageRequest).subscribe({
      next: ({ services }) => {
        this.servicesRes = services
        console.log(services.toString());
        this.loaded = true;

      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  constructor(private serviceService: ServicesService) {}

  initialize(): void {
    this.loaded = false;

    this.columns = [
      { name: 'Id', field: 'id', align: 'left', color: 'black', font: '' },
      { name: 'Name', field: 'name', align: 'left', color: 'text-primary', font: 'bold' },
      { name: 'Date', field: 'releaseDate', align: 'center', color: 'text-primary', font: '' },
    ];
  }

}
