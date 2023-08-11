import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceConstant } from '../../constance/service.constance'
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
@Injectable({
  providedIn: "root",
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
  public static URL = "http://localhost:3000/api/v1/";

  getGraph(id: string) {
    const url = `${ServiceConstant.backendUrl}/graph/${id}`;

    return this.httpClient.get(url, { responseType: "text" }).pipe(
      map((svgString: string) => {
        // Create a DOMParser to parse the SVG string into a DOM object
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Assuming you have an SVG container in your component's template with the id "svgContainer"
        const svgContainer = document.getElementById("svgContainer");
        svgContainer.appendChild(svgElement);

        return svgString;
      }),
      catchError((error: any) => {
        console.error("Error fetching graph:", error);
        throw error;
      })
    );
  }


  getdatas() {
    const token = localStorage.getItem("accessToken");

    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    const options = {
      headers: httpHeaders,
    };

    let url = ServiceConstant.backendUrl+"/";
    return this.httpClient.get(url, options);
  }
}
