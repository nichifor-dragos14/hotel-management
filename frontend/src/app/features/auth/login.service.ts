import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserClaims } from './user-claims.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.isTokenValid());
  private userRole = new BehaviorSubject<string>(this.getLoggedUserRole());
  
  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  get userRole$(): Observable<string> {
    return this.userRole.asObservable();
  }

  logout() {
    localStorage.removeItem('JWT');

    this.isLoggedIn.next(false);
    this.userRole.next('');
  }

  notifyLoginSuccess() {
    this.isLoggedIn.next(true);
    this.userRole.next(this.getLoggedUserRole());
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

  private decodeToken() {
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

  getLoggedUserEmail() {
    let claims = this.decodeToken();

    if (claims == null) {
      throw Error('No user logged in');
    }

    return claims['emailaddress'];
  }

  getLoggedUserId() {
    let claims = this.decodeToken();

    if (claims == null) {
      throw Error('No user logged in');
    }

    return claims['nameidentifier'];
  }

  getLoggedUserRole() {
    let claims = this.decodeToken();

    if (claims == null) {
      return '';
    }

    return claims['role'];
  }
}
