import { Component, OnInit } from '@angular/core';
import { UserService } from "src/app/services/user/user.service";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { NgIf } from "@angular/common";

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
  showModal: boolean = false;
  emailAddress: string = "";
  isLoading: boolean = false; 
  
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

  // getData() {
  //   this.userservice.getDatasvulnerabilities(this.currentPage, this.recordsPerPage).subscribe(
  //     (res: any) => {
  //       this.datas = res;
  //       console.log("hi", this.datas);
  //       this.datas.forEach((booking: any) => {
  //         if (booking.vulnerability_info > 7) {
  //           this.showModal = true;
  //         }
  //       });
  //     },
  //     (error: any) => {
  //       console.error("Error fetching data:", error);
  //     }
  //   );
  // }

  fetchPieChart(id: string) {
    this.isLoading = true;
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
        this.isLoading = false;
      },
      (error: any) => {
        console.error("Error fetching pie chart:", error);
        this.isLoading = false;
      }
    );
  }

  fetchGraph() {
    this.isLoading = true;
    this.fetchPieChart(this.graphId);
    this.isLoading = false;
  }

  displayGraph(id: string) {
    this.graphId = id; // Set the graphId to the selected booking.id
    this.fetchGraph();
  }3

  fetchVulnerabilitiesChart() {
    this.isLoading = true;
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
        this.isLoading = false;
      }
    );
  }
 

  openModel(){
    const modelDiv= document.getElementById('myModal');
    if(modelDiv!=null){
      modelDiv.style.display='block';
      this.showModal = true;
    }
  }

  closeModal() {
    const modelDiv= document.getElementById('myModal');
    if(modelDiv!=null){
      modelDiv.style.display='none';
      this.showModal = false;
    }
  }

  getData() {
    this.isLoading = true;
    this.userservice.getDatasvulnerabilities(this.currentPage, this.recordsPerPage).subscribe(
      (res: any) => {
        this.datas = res;
        console.log("hi", this.datas);
        this.showModal = this.datas.some((booking: any) => booking.vulnerability_info > 7);
        this.isLoading = false;
      },
      (error: any) => {
        console.error("Error fetching data:", error);
        this.isLoading = false;
      }
    );
  }

  prepareTableData() {
    // Create an array of arrays for table data
    const tableData = this.datas.map((booking: any) => [
      booking.id,
      booking.protocol,
      booking.source,
      booking.destination,
      booking.vulnerability_info,
    ]);
    return tableData;
  }

  downloadPDF() {
    this.isLoading = true;
    const doc = new (jsPDF as any)(); // Use type assertion
    const tableData = this.prepareTableData();
  
    // Add title to the first page
    doc.setFontSize(18);
    doc.text("SDN CONTROLLER - Vulnerability Report", 40, 10); // Adjust position as needed
  
    // Add the table
    doc.autoTable({
      head: [['ID', 'Protocol', 'Source', 'Destination', 'vulnerability_report']],
      body: tableData,
      startY: 30, // Adjust starting position for the table
    });
  
    // Add a new page for the graphs
    doc.addPage();
  
    // Render the existing graph
    const existingGraphContainer = document.getElementById("svgContainer");
    const existingSvgString = existingGraphContainer.innerHTML;
    const existingParser = new DOMParser();
    const existingSvgDoc = existingParser.parseFromString(existingSvgString, "image/svg+xml");
    const existingSvgElement = existingSvgDoc.documentElement;
    const existingSvgData = new XMLSerializer().serializeToString(existingSvgElement);
    const existingCanvas = document.createElement("canvas");
    const existingContext = existingCanvas.getContext("2d");
    const existingImg = new Image();
    existingImg.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(existingSvgData)));
    existingImg.onload = () => {
      existingCanvas.width = existingImg.width;
      existingCanvas.height = existingImg.height;
      existingContext.drawImage(existingImg, 0, 0);
      const existingGraphImage = existingCanvas.toDataURL("image/jpeg", 1.0);
      doc.addImage(existingGraphImage, "JPEG", 10, 10, 180, 100); // Adjust the position and size as needed
  
      // Fetch vulnerabilities chart and add it to the PDF
      this.userservice.getVulnerabilitiesChart().subscribe(
        (chartBlob: Blob) => {
          const chartUrl = window.URL.createObjectURL(chartBlob);
          const vulnerabilitiesChart = new Image();
          vulnerabilitiesChart.src = chartUrl;
          vulnerabilitiesChart.onload = () => {
            // Add a new page for the vulnerabilities chart
            doc.addPage();
            doc.addImage(vulnerabilitiesChart, "JPEG", 10, 10, 180, 100); // Adjust the position and size as needed
            doc.save('SDN_Controller_Identifying_report.pdf');
            this.isLoading = false;
          };
        },
        (error: any) => {
          console.error("Error fetching vulnerabilities chart:", error);
          this.isLoading = false;
        }
      );
    };
  }


  sendEmail() {
    this.isLoading = true;
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
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error sending email:', error);
          this.isLoading = false;
        }
      );
    };
  }
  
  
  
}
