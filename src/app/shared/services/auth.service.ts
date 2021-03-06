import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IUser } from 'src/app/models/user';
import { users } from '../user-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<IUser>;
  public user: Observable<IUser>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<IUser>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): IUser {
    return this.userSubject.value;
  }

  login(username: string, password: string){
    const userFound = users.find(
      (user) => user.username === username && user.password === password
    );
    if (userFound) {
      this.userSubject.next(userFound);
      localStorage.setItem('user', JSON.stringify(userFound));
    }
    return of(userFound);


    // return this.http.post<IUser>(`${environment.apiUrl}/users/authenticate`, { username, password })
    //     .pipe(map(user => {
    //         // store user details and jwt token in local storage to keep user logged in between page refreshes
    //         localStorage.setItem('user', JSON.stringify(user));
    //         this.userSubject.next(user);
    //         return user;
    //     }));
  }

  // logout() {
  //     // remove user from local storage and set current user to null
  //     localStorage.removeItem('user');
  //     this.userSubject.next(null);
  //     this.router.navigate(['/account/login']);
  // }

  // register(user: IUser) {
  //     return this.http.post(`${environment.apiUrl}/users/register`, user);
  // }

  // getAll() {
  //     return this.http.get<IUser[]>(`${environment.apiUrl}/users`);
  // }

  // getById(id: string) {
  //     return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`);
  // }

  // update(id, params) {
  //     return this.http.put(`${environment.apiUrl}/users/${id}`, params)
  //         .pipe(map(x => {
  //             // update stored user if the logged in user updated their own record
  //             if (id == this.userValue.id) {
  //                 // update local storage
  //                 const user = { ...this.userValue, ...params };
  //                 localStorage.setItem('user', JSON.stringify(user));

  //                 // publish updated user to subscribers
  //                 this.userSubject.next(user);
  //             }
  //             return x;
  //         }));
  // }

  // delete(id: string) {
  //     return this.http.delete(`${environment.apiUrl}/users/${id}`)
  //         .pipe(map(x => {
  //             // auto logout if the logged in user deleted their own record
  //             if (id == this.userValue.id) {
  //                 this.logout();
  //             }
  //             return x;
  //         }));
  // }
}
