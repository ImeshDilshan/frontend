import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user/user.service";
import { Router } from "@angular/router"; 
import jsPDF from "jspdf";
import "jspdf-autotable";




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
  currentPage: number = 1;
  recordsPerPage: number = 20;
  emailAddress: string = "";

  constructor(private userservice: UserService, private router: Router) {}

  ngOnInit() {
    this.getData();
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
    this.userservice.getDatas(this.currentPage, this.recordsPerPage).subscribe(
      (res: any) => {
        this.datas = res;
        console.log("hi", this.datas);
      },
      (error: any) => {
        console.error("Error fetching data:", error);
      }
    );
  }


  downloadPDF() {
    const doc = new (jsPDF as any)(); // Use type assertion
    const tableData = this.prepareTableData();
  
    // Add title to the first page
    doc.setFontSize(18);
    doc.text("SDN CONTROLLER - Event Flow Graph Report", 40, 10); // Adjust position as needed
  
    // Add the table
    doc.autoTable({
      head: [['ID', 'Protocol', 'Source', 'Destination', 'Length']],
      body: tableData,
      startY: 30, // Adjust starting position for the table
    });
  
    // Add a new page for the graph
    doc.addPage();
    const graphContainer = document.getElementById("svgContainer");
    const svgString = graphContainer.innerHTML;
  
    // Parse the SVG and add it to the PDF
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    const svgData = new XMLSerializer().serializeToString(svgElement);
  
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
  
      const graphImage = canvas.toDataURL("image/jpeg", 1.0);
      doc.addImage(graphImage, "JPEG", 10, 10, 180, 100); // Adjust the position and size as needed
  
      doc.save('SDN_Controller_Event_Flow_Graph_Report.pdf');
    };
  }
  
  
  
  prepareTableData() {
    // Create an array of arrays for table data
    const tableData = this.datas.map((booking: any) => [
      booking.id,
      booking.protocol,
      booking.source,
      booking.destination,
      booking.length,
    ]);
    return tableData;
  }

  sendEmail() {
    const graphContainer = document.getElementById('svgContainer');
    const svgString = graphContainer.innerHTML;

    const doc = new (jsPDF as any)(); // Use type assertion
    const tableData = this.prepareTableData();

    doc.autoTable({
      head: [['ID', 'Protocol', 'Source', 'Destination', 'Length']],
      body: tableData,
    });

    // Add a new page for the graph
    doc.addPage();

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgString)));

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const graphImage = canvas.toDataURL('image/jpeg', 1.0);
      doc.addImage(graphImage, 'JPEG', 10, 10, 180, 100); // Adjust the position and size as needed

      // Send the email with PDF attachment
      this.userservice.sendEmail(this.emailAddress, doc.output('datauristring')).subscribe(
        (response: any) => {
          console.log('Email sent:', response.message);
        },
        (error: any) => {
          console.error('Error sending email:', error);
        }
      );
    };
  }




}
