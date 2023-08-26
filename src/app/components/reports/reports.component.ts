import { Component, OnInit } from "@angular/core";
import * as chartData from "../../shared/data/chart";
import { reportDB } from "src/app/shared/tables/report";
import { SalesService } from "src/app/services/sales.service";
import { IAngularMyDpOptions } from "angular-mydatepicker";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  public report = [];
  likesCount: number = 0;
  incidentsCount: number = 0;
  dislikesCount: number = 0;
  graphId: string;
  datas: any = [];
  currentPage: number = 1;
  recordsPerPage: number = 20;
  sales;
  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: "yyyy-mm-dd",
  };
  createdStartDate: any = "";
  createdEndDate: any = "";

  constructor(private salesservice: SalesService) {
    this.report = reportDB.report;
  }

  // lineChart
  public salesChartData = chartData.salesChartData;
  public salesChartLabels = chartData.salesChartLabels;
  public salesChartOptions = chartData.salesChartOptions;
  public salesChartColors = chartData.salesChartColors;
  public salesChartLegend = chartData.salesChartLegend;
  public salesChartType = chartData.salesChartType;

  public areaChart1 = chartData.areaChart1;
  public columnChart1 = chartData.columnChart1;
  public lineChart = chartData.lineChart;

  public chart5 = chartData.chart6;

  public settings = {
    actions: {
      position: "right",
    },
    columns: {
      Items: {
        title: "Items",
      },
      Amount: {
        title: "Amount",
        type: "html",
      },
      Cash: {
        title: "Cash",
      },
      total: {
        title: "Total",
      },
      Balance: {
        title: "Balnce",
      },
    },
  };

  ngOnInit() {}

  // loadsales() {
  //   this.salesservice.getSales().subscribe((res: any) => {
  //     this.sales = res;
  //     console.log(this.sales);
  //   });
  // }

  // loadSaleswithdate() {
  //   this.salesservice.getSalesBydate().subscribe
  // }

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
}
