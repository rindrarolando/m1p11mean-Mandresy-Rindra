import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../core/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
      // actual Token
      const token = this.authService.getToken();


      if (token) {
          // Adding token to headers
          const cloned = req.clone({
              headers: req.headers.set("Authorization", "Bearer " + token)
          });

          return next.handle(cloned);
      }
      else {
          return next.handle(req);
      }
    }
}
