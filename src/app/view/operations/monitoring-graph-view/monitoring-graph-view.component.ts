import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from "src/app/services/common.service";


declare const bootstrap: any;


@Component({
  selector: 'app-monitoring-graph-view',
  templateUrl: './monitoring-graph-view.component.html',
  styleUrls: ['./monitoring-graph-view.component.scss']
})
export class MonitoringGraphViewComponent implements OnInit {





  constructor(public dialogRef: MatDialogRef<MonitoringGraphViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public service: CommonService) { dialogRef.disableClose = true; }




  ngOnInit(): void {
  }




  tooltipContent(item: any): string {
    return `
      Step Name: ${item.stepName || 'NA'}
      No of Tasks: ${item.noOfProcess || 'NA'}
      Completed Tasks: ${item.completeProcess == null ? 'NA' : item.completeProcess}
      Start Time: ${item.startTime == null ? 'NA' : item.startTime}
      End Time: ${item.endTime == null ? 'NA' : item.endTime}
      Last Turnover Time: ${item.expectedTime == null ? 'NA' : item.expectedTime}
    `;
  }


}
