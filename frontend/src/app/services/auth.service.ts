import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  public isAuth = false;

  constructor(private http: HttpClient) {}

  getToken() {
    return localStorage.getItem("salonToken")
  }

  login(email:string, password:string ) {
      return this.http.post(this.apiUrl + 'auth/login', {"email": email,"password": password}, { observe: 'response' });
  }

  logout() {
      localStorage.removeItem("salonToken");
      this.isAuth = false;
  }

}
