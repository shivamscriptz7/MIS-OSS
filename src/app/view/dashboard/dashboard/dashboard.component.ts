import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "src/app/services/common.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SocketService } from 'src/app/services/socket.service'
import * as CryptoJS from 'crypto-js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexResponsive,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  legend: ApexLegend | any;
  responsive: ApexResponsive[] | any;
  labels: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | any;
  public pieChart: Partial<ChartOptions> | any;
  public donutChart: Partial<ChartOptions> | any;
  public userModuleChart: Partial<ChartOptions> | any;
  public schedulerChart: Partial<ChartOptions> | any;
  public ActivePostpaidCustomerChart: Partial<ChartOptions> | any;

  // multiple charts 
  public lineChartOptions: Partial<ChartOptions> | any;

  public totalCircle: any;
  public totalReport: any;
  public totalZone: any;
  public data: any;
  public logindata: any;
  public userId: any;
  // use for circleChartInactiveCostumer chart
  public circleChart: any;
  public arrCircleData: any = Array();
  public arrcircleCount: any = Array();

  // use for circle active Costumer chart
  public circleChart1: any;
  public arrCircleData1: any = Array();
  public arrcircleCount1: any = Array();

  public activeInActiveUser: any = Array();
  public activeInActiveSchedule: any = Array();

  public totalUsers: any;
  public loginSubscription: any;
  public chartSq: any = 1;


  // newwww
  public pieChartVar: any;
  public pieChartVarAciveUser: any;
  public barChartTypeVar: any
  public listChartVar: any;




  constructor(public service: CommonService, public ngxLoader: NgxUiLoaderService, private socketService: SocketService,) {
  }
  ngOnInit(): void {
    this.dashboardChartsData();
    this.getDashboardCount();
    this.dashboardCharts();
    let logindata: any = localStorage.getItem("userData");
    let decryptUserData = CryptoJS.AES.decrypt(logindata, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    logindata = JSON.parse(decryptUserData)
    this.userId = logindata.USER_ID;
    this.socketConnection();
    this.onChangeCharts(null);

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.loginSubscription !== undefined) {
      this.loginSubscription.unsubscribe();
    }
  }



  clicks(id: any) {
    this.chartSq = 0;
    setTimeout(() => {
      this.chartSq = id;
    })
  }
  public socketConnection() {
    this.loginSubscription = this.socketService.login(this.userId);
    //this.loginSubscription = this.socketService.onLoginSuccess(this.userId)
  }

  chartShow: boolean = false;
  // user for dashboard charts 
  dashboardCharts() {
    setTimeout(() => {

      this.pieChart = {
        series: this.arrcircleCount,
        chart: {
          width: '100%',
          height: '210px',
          type: "pie"
        },
        legend: {
          show: true,
          floating: false,
          fontSize: "13px",
          position: "right", // Change position to 'left' for proper alignment
          offsetX: -10,
          offsetY: -20,
          horizontalAlign: 'left', // Align legend text to the left
          labels: {
            useSeriesColors: false, // Optional: Use series colors for legend labels
          }
        },
        labels: this.arrCircleData,
        responsive: [
          {
            breakpoint: 991,
            options: {
              chart: {
                width: '100%',
                height: '230px',
              },
              legend: {
                show: true,
                position: "right", // Ensure left position on smaller screens
                horizontalAlign: 'left', // Ensure left alignment on smaller screens as well
              }
            }
          }
        ]
      };

      // pie chart for circle data and count 
      this.donutChart = {
        series: this.arrcircleCount1,
        chart: {
          type: "donut",
          width: '100%',
          height: '210px',
        },
        legend: {
          position: "top"
        },
        labels: this.arrCircleData1,
        responsive: [
          {
            breakpoint: 991,
            options: {
              chart: {
                width: '100%',
                height: '230px',
              },
              legend: {
                show: false,
              }
            }
          }
        ]
      };

      // line chart
      this.lineChartOptions = {
        series: [
          {
            name: "Circles",
            data: this.arrcircleCount
          }
        ],
        chart: {
          height: 210,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          align: "center"
        },
        grid: {
          row: {
            colors: ["#f3f3f3"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.arrCircleData,
        }
      };



      this.ActivePostpaidCustomerChart = {
        series: [
          {
            name: "Circle",
            data: this.arrcircleCount1
          }
        ],
        chart: {
          type: "bar",
          width: '100%',
          height: '210',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 7,
          colors: ["transparent"]
        },
        xaxis: {
          categories: this.arrCircleData1
        },
        yaxis: {
          title: {

          }

        },
        fill: {
          opacity: 1
        },
        colors: ["#ae9ffa"],  // Define colors here
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val;

            }
          }
        }
      };

      /************NEW Dashboard**********/

      // it is used  for user to show % in graph  
      let User_percentage = [Math.round((this.activeInActiveUser[0] / this.activeInActiveUserCount) * 100).toFixed(2)];
      User_percentage.push(Math.round((this.activeInActiveUser[1] / this.activeInActiveUserCount) * 100).toFixed(2));

      this.userModuleChart = {
        series: User_percentage,
        chart: {
          height: 250,
          type: "radialBar",
          toolbar: {
            show: false
          },
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 300,
            hollow: {
              margin: 5,
              size: "65%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: true,
                fontSize: "200px"
              },
              value: {
                show: true,
              },
              total: {
                show: true,
                label: `Total: ${this.activeInActiveUserCount}`,
                formatter: function () {
                  return;
                }
              }
            }
          }
        },
        colors: ["#FFD703", "#22c55ecc"],
        labels: ["Inactive", "Active"],
        legend: {
          show: true,
          floating: true,
          fontSize: "13px",
          position: "right",
          offsetX: -20,
          offsetY: -10,
          horizontalAlign: 'left',
          labels: {
            useSeriesColors: false
          },
          formatter: (seriesName: string, opts: any) => {
            const value = this.activeInActiveUser[opts.seriesIndex];
            return `${seriesName}: ${value}`;
          },
          itemMargin: {
            horizontal: 1
          }
        }
      };

      /****************/

      let schedule_percentage = [Math.round((this.activeInActiveSchedule[0] / this.activeInActiveScheduleCount) * 100).toFixed(2), Math.round((this.activeInActiveSchedule[1] / this.activeInActiveScheduleCount) * 100).toFixed(2)];
      schedule_percentage.push(Math.round((this.activeInActiveSchedule[2] / this.activeInActiveScheduleCount) * 100).toFixed(2));
      this.schedulerChart = {
        series: schedule_percentage,
        chart: {
          height: 250,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 300,
            hollow: {
              margin: 5,
              size: "65%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: true,
                fontSize: "20px"
              },
              value: {
                show: true
              },
              total: {
                show: true,
                label: `Total: ${this.activeInActiveScheduleCount} `,
                colors: ["#000000"],
                formatter: function () {
                  return;
                }
              }
            }
          }
        },
        colors: ["#22c55ecc", "#FFD703", "#FF3232"],
        labels: ["Running", "Inactive", "Error"],
        legend: {
          show: true,
          floating: true,
          fontSize: "13px",
          position: "right",
          offsetX: -20,
          offsetY: -10,
          horizontalAlign: 'left',
          labels: {
            useSeriesColors: false
          },
          formatter: (seriesName: string, opts: any) => {
            const value = this.activeInActiveSchedule[opts.seriesIndex];
            return `${seriesName}: ${value}`;
          },

          itemMargin: {
            horizontal: 3
          }
        }
      };

      this.chartShow = true;
    }, 2000);
  }


  // multi charts

  public jobData: any;
  public allJobData: any;
  // use for get data of all charts
  dashboardChartsData() {
    this.ngxLoader.start();
    this.service.getAPIMethod('/getDashboardChartData').subscribe((res => {
      this.circleChart = res?.result[1];
      this.circleChart1 = res?.result[2];
      this.jobData = res?.result[3];

      this.allJobData = this.jobData.map((item: any) => JSON.parse(item.JOB_JSON));
      this.ngxLoader.stop();
      for (let i = 0; i < this.circleChart?.length; i++) {//this loop is used for show circle data chart 
        this.arrcircleCount.push(this.circleChart[i]?.CIRCLE_COUNT),
          this.arrCircleData.push(this.circleChart[i]?.CIRCLE)
      }
      for (let i = 0; i < this.circleChart1?.length; i++) {
        this.arrcircleCount1.push(this.circleChart1[i].CIRCLE_COUNT),
          this.arrCircleData1.push(this.circleChart1[i].CIRCLE)
      }
    }));
  }

  public slrReportCount: any = Array();
  public prepaidReportMonth: any = Array();
  public prepaidReportCount: any = Array();
  public totalSlrReports: any;
  public totalPrepaidReports: any;
  public totalBssReports: any;
  public activeInActiveUserCount: any;
  public activeInActiveScheduleCount: any;
  public totalBa: any;
  public totalMonitoringCount: any;
  //  use for dashboard count 
  getDashboardCount() {
    this.service.getAPIMethod('/getDashboardCount').subscribe((res) => {
      let data = res.result;
      this.totalCircle = res.result[0].TOTAL_CIRCLE;
      this.totalReport = res.result[0].TOTAL_REPORTS;
      this.totalBa = res.result[0].TOTAL_BA;
      this.totalZone = res.result[0].TOTAL_ZONE;
      this.activeInActiveUser = [res.result[0]?.TOTAL_ACTIVE_USERS, res.result[0]?.TOTAL_INACTIVE_USERS];
      this.activeInActiveUserCount = res.result[0]?.TOTAL_USERS;
      this.activeInActiveSchedule = [res.result[0]?.ACTIVE_SCHEDULER, res.result[0]?.INACTIVE_SCHEDULER, res.result[0].ERROR_SCHEDULER];
      this.activeInActiveScheduleCount = res.result[0]?.ACTIVE_SCHEDULER + res.result[0]?.INACTIVE_SCHEDULER + res.result[0]?.ERROR_SCHEDULER;
      this.totalSlrReports = res.result[0]?.SLR_REPORTS;
      this.totalPrepaidReports = res.result[0]?.PREPAID_REPORTS;
      this.totalBssReports = res.result[0]?.BSS_REPORTS;
      this.totalMonitoringCount = res.result[0].TOTAL_MONITORING_DATA;
    });
  }

  tooltipContent(item: any) {
    return `
      Step Name: ${item.STEP_NAME || 'NA'}
      No of Tasks: ${item.NO_OF_PROCESS || 'NA'}
      Completed Tasks: ${item.COMPLETE_PROCESS == null ? 'NA' : item.COMPLETE_PROCESS}
      Start Time: ${item.START_PROCESS_TIME == null ? 'NA' : item.START_PROCESS_TIME}
      End Time: ${item.END_PROCESS_TIME == null ? 'NA' : item.END_PROCESS_TIME}
      Last Turnover Time: ${item.EXPECTED_TIME == null ? 'NA' : item.EXPECTED_TIME}
     
    `;
  }



  public localStorageChart: any = {
    chart_1: 'pieChart',
    chart_2: 'barChart'
  };
  public selectedChart_1: any;
  public selectedChart_2: any;

  private encryptionKey = 'Rw7]HwL5cXH$zkh';
  onChangeCharts(event: any) {
    this.loadChartsFromLocalStorage();
    if (event) {
      const target = event.target as HTMLInputElement;
      const id = target.id;
      const value = target.value;
      this.localStorageChart[id] = value;
      this.saveChartsToLocalStorage();
    }
    this.updateChartVariables();
  }

  loadChartsFromLocalStorage() {
    const localGraphValue = localStorage.getItem("dashboardCharts");
    if (localGraphValue) {
      try {
        const decryptedData = CryptoJS.AES.decrypt(localGraphValue, this.encryptionKey).toString(CryptoJS.enc.Utf8);
        const parsedData = JSON.parse(decryptedData);
        this.localStorageChart = parsedData;

      } catch (e) {
        console.error('Failed to parse decrypted data', e);
      }
    }
    this.selectedChart_1 = this.localStorageChart.chart_1;
    this.selectedChart_2 = this.localStorageChart.chart_2;
  }

  saveChartsToLocalStorage() {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(this.localStorageChart), this.encryptionKey).toString();
    localStorage.setItem("dashboardCharts", encryptedData);
  }
  updateChartVariables() {
    this.pieChartVar = this.localStorageChart.chart_1;
    this.pieChartVarAciveUser = this.localStorageChart.chart_2;
  }


}

