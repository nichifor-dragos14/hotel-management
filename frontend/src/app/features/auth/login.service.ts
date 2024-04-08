import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  logout() {
    sessionStorage.removeItem('JWT');
  }

  checkLogin(): Observable<boolean> {
    const jwtToken = sessionStorage.getItem('JWT');

    if (!jwtToken) {
      return of(false);
    }

    const tokenData = JSON.parse(atob(jwtToken.split('.')[1]));

    if (!tokenData || !tokenData.exp) {
      return of(false);
    }

    const expirationTime = tokenData.exp * 1000;

    const currentTime = new Date().getTime();

    if (currentTime > expirationTime) {
      return of(false);
    }

    return of(true);
  }

  async AddJWTToSessionStorage(JWT: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (JWT.length != 0) {
        try {
          sessionStorage.setItem('JWT', JWT);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Session storage is not available and JWT is empty.'));
      }
    });
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const jwtToken = sessionStorage.getItem('JWT');

    if (jwtToken) {
      headers = headers.set('Authorization', `Bearer ${jwtToken}`);
    }

    return headers;
  }
}
