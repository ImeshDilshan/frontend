import { Component, OnInit } from '@angular/core';
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  likesCount: number = 0;
  incidentsCount: number = 0;
  dislikesCount: number = 0;
  graphId: string="1"
  datas: any = [];
  currentPage: number = 1;
  recordsPerPage: number = 20;

  constructor(private userservice: UserService) {}

  ngOnInit() {
    this.getData();
    this.fetchVulnerabilitiesChart();
    this.fetchPieChart('1');
  }

  nextPage() {
    if (this.datas.length === this.recordsPerPage) {
      this.currentPage++;
      this.getData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getData();
    }
  }

  getData() {
    this.userservice
      .getDatasvulnerabilities(this.currentPage, this.recordsPerPage)
      .subscribe(
        (res: any) => {
          this.datas = res;
          console.log("hi", this.datas);
        },
        (error: any) => {
          console.error("Error fetching data:", error);
        }
      );
  }

  fetchPieChart(id: string) {
    this.userservice.getPieChart(this.graphId).subscribe(
      (svgString: string) => {
        // Parse the SVG string and display it in your component
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Assuming you have an SVG container in your component's template with the id "svgContainer"
        const svgContainer = document.getElementById("svgContainer");
        svgContainer.innerHTML = ""; // Clear previous SVG
        svgContainer.appendChild(svgElement);
      },
      (error: any) => {
        console.error("Error fetching pie chart:", error);
      }
    );
  }

  fetchGraph() {
    this.fetchPieChart(this.graphId);
  }

  displayGraph(id: string) {
    this.graphId = id; // Set the graphId to the selected booking.id
    this.fetchGraph();
  }3

  fetchVulnerabilitiesChart() {
    this.userservice.getVulnerabilitiesChart().subscribe(
      (chartBlob: Blob) => {
        // Create a URL for the blob
        const chartUrl = window.URL.createObjectURL(chartBlob);

        // Assuming you have an image element in your component's template with the id "vulnerabilitiesChart"
        const vulnerabilitiesChart = document.getElementById(
          "vulnerabilitiesChart"
        ) as HTMLImageElement;
        vulnerabilitiesChart.src = chartUrl;
      },
      (error: any) => {
        console.error("Error fetching vulnerabilities chart:", error);
      }
    );
  }
}
