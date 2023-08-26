import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { ServiceConstant } from '../constance/service.constance';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private httpClient: HttpClient) { }

  // getSales() {
  //   const token = localStorage.getItem("accessToken");

  //   const httpHeaders = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   });

  //   const options = {
  //     headers: httpHeaders,
  //   };

  //   let url = ServiceConstant.backendUrl + "/api/v1/transactions/sales";
  //   return this.httpClient.get(url, options);
  // }

  // getSalesBydate(accountId:any,startDate:any,endDate:any){
  //   const token = localStorage.getItem('accessToken') as string;
  //   const httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization' : token
  //   });
  //   let params = new HttpParams();
  //   params = params.append("accountId", accountId);
  //   params = params.append("startDate", startDate);
  //   params = params.append("endDate", endDate);
  //     const options = {
  //       headers: httpHeaders,
  //       params:params
  //     }; 

  //     let url = ServiceConstant.backendUrl + "/api/v1/transactions/sales/search";
    
  //   return this.httpClient.get(url,options);
  // }

}
