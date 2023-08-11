import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user/user.service";
import { Router } from "@angular/router"; 

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  likesCount: number = 0;
  incidentsCount: number = 0;
  dislikesCount: number = 0;
  graphId: string;
  datas: any = [];

  constructor(private userservice: UserService, private router: Router) {}

  ngOnInit() {
    this.getdata()
  }

  updateStats() {
    const totalResponses = this.likesCount + this.dislikesCount;
    const likesPercentage =
      totalResponses > 0
        ? ((this.likesCount / totalResponses) * 100).toFixed(1)
        : "0";
    const dislikesPercentage =
      totalResponses > 0
        ? ((this.dislikesCount / totalResponses) * 100).toFixed(1)
        : "0";

    const likesCountElem = document.getElementById("likesCount");
    const dislikesCountElem = document.getElementById("dislikesCount");
    const likesPercentageElem = document.getElementById("likesPercentage");
    const dislikesPercentageElem =
      document.getElementById("dislikesPercentage");
    const incidentsCountElem = document.getElementById("incidentsCount");

    if (
      likesCountElem &&
      dislikesCountElem &&
      likesPercentageElem &&
      dislikesPercentageElem &&
      incidentsCountElem
    ) {
      likesCountElem.textContent = this.likesCount.toString();
      dislikesCountElem.textContent = this.dislikesCount.toString();
      likesPercentageElem.textContent = `(${likesPercentage}%)`;
      dislikesPercentageElem.textContent = `(${dislikesPercentage}%)`;
      incidentsCountElem.textContent = (
        this.likesCount + this.dislikesCount
      ).toString();
    }
  }

  handleResponse(response: string) {
    this.incidentsCount++;

    if (response === "like") {
      this.likesCount++;
      this.dislikesCount = 0; // Reset dislikes count to 0
    } else if (response === "dislike") {
      this.dislikesCount++;
      this.likesCount = 0; // Reset likes count to 0
    }

    this.updateStats();
  }

  fetchGraph() {
    this.userservice.getGraph(this.graphId).subscribe(
      (svgString: string) => {
        // The SVG content has been fetched and displayed
        console.log("SVG content fetched and displayed.");

        // Perform additional actions
        this.doAdditionalActions(svgString);

        // Redirect the user to the specified page
        this.router.navigate([
          "http://localhost:5000/api/bookings/graph/",
          this.graphId,
        ]);
      },
      (error: any) => {
        // Handle error
           this.router.navigate([
             
                 "http://localhost:5000/api/bookings/graph/",
             this.graphId,
           ]);
        console.error("Error fetching SVG content:", error);
        // You might want to update your component's state to reflect the error
      }
    );
  }

  doAdditionalActions(svgString: string) {
    // Example: Parse the SVG string to manipulate the SVG using D3.js or other methods
    // For instance, you can add event listeners, change colors, etc.
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // You can manipulate the SVG element or its properties here
    // For example, changing colors or adding event listeners
    svgElement.setAttribute("fill", "green");

    // Append the modified SVG to the container
    const svgContainer = document.getElementById("svgContainer");
    svgContainer.innerHTML = ""; // Clear previous content
    svgContainer.appendChild(svgElement);
  }

  getdata() {
    this.userservice.getdatas().subscribe((res: any) => {
      this.datas = res
      console.log("hi", this.datas);
    })
  }


}
