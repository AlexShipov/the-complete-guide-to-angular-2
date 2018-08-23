import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedFlag: boolean = false;

  constructor() { }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signinUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {
      this.isAuthenticatedFlag = true;
      return cred;
    });
  }

  signOut() {
    return firebase.auth().signOut().then(() => this.isAuthenticatedFlag = false);
  }

  getToken(): Promise<string> {

    return firebase.auth().currentUser.getIdToken();
  }

  isAuthenticated(): boolean { return this.isAuthenticatedFlag; }
}
