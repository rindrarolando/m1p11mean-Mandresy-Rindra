import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IPageRequest } from '../interfaces/IPageRequest';

/**
 * Service for services(make up, manucure, pedicure, ...) endpoint
 */
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = environment.apiUrl + 'services';

  constructor(private http: HttpClient) { }

  fetchAllServices({pageNumber, rowsPerPage }: IPageRequest) {
    return this.http.get<any>(this.apiUrl , { params: {pageNumber, rowsPerPage}})
  }

}
