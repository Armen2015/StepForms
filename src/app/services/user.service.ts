import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';



@Injectable()
export class UserService {
    user = new User();
    constructor(private http: HttpClient) { }

    create(user: User) {
        return this.http.post('http://localhost:8000/api/users', user);
    }

    checkUser(userName: string) {
        return this.http.post('http://localhost:8000/api/checkusers', {userName: userName});
    }

    findSponsor(sponsorUserName: string) {
        return this.http.post('http://localhost:8000/api/findsponsor', {sponsorUserName: sponsorUserName});
    }
}