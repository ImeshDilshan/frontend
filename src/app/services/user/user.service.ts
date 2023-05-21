import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceConstant } from '../../constance/service.constance'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  // login(){
  //   console.log("helo")
  // }
  // onLogin(loginInfo) {
  //   let req = ServiceConstant.backendUrl + "/auth/login";
  //   return this.httpClient.post(req, loginInfo);
  // }

  
}
