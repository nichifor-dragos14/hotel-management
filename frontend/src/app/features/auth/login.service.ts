import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserClaims } from './user-claims.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.isTokenValid());

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  logout() {
    localStorage.removeItem('JWT');
    this.isLoggedIn.next(false);
  }

  notifyLoginSuccess() {
    this.isLoggedIn.next(true);
  }

  private isTokenValid(): boolean {
    const jwtToken = localStorage.getItem('JWT');

    if (!jwtToken) {
      return false;
    }

    const tokenData = JSON.parse(atob(jwtToken.split('.')[1]));

    if (!tokenData || !tokenData.exp) {
      return false;
    }

    const expirationTime = tokenData.exp * 1000;

    const currentTime = new Date().getTime();

    if (currentTime > expirationTime) {
      return false;
    }

    return true;
  }

  validateTokenAndUpdateState(): void {
    const isValid = this.isTokenValid();
    this.isLoggedIn.next(isValid);
  }

  async AddJWTToSessionStorage(JWT: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (JWT.length != 0) {
        try {
          localStorage.setItem('JWT', JWT);
          this.notifyLoginSuccess();
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Session storage is not available and JWT is empty.'));
      }
    });
  }

  decodeToken() {
    const jwtToken = localStorage.getItem('JWT');

    if (!jwtToken || !this.isTokenValid()) {
      return null;
    }

    const decodedToken: any = jwtDecode(jwtToken);
    let claims: UserClaims = {};

    for (let prop in decodedToken) {
      if (
        decodedToken.hasOwnProperty(prop) &&
        !['exp', 'iss', 'aud'].includes(prop)
      ) {
        const segments = prop.split('/');
        const lastSegment = segments[segments.length - 1];

        claims[lastSegment] = decodedToken[prop];
      }
    }

    return claims;
  }
}
