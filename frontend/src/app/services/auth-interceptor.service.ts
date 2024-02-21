import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
      // Token actuel
      const token = this.authService.getToken();
      console.log(`Token in interceptor`);


      if (token) {
          // Ajout du token dans l'entête
          const cloned = req.clone({
              headers: req.headers.set("Authorization", token)
          });

          return next.handle(cloned);
      }
      else {
          return next.handle(req);
      }
    }
}
