import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-custom-pdf-download-box',
  templateUrl: './custom-pdf-download-box.component.html',
  styleUrls: ['./custom-pdf-download-box.component.scss']
})
export class CustomPdfDownloadBoxComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<CustomPdfDownloadBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public service: CommonService) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    // here we are remove USER_IMAGE from Data   
    this.data.customData = this.data.customData.filter((key: any) => key !== "USER_IMAGE");
  }
  public customFlag: any;
  public customVar: any = false;
  public customDataKeysArray: any = [];
  public customDataValuesArray: any = [];



  onSubmit() {
    if (this.customDataValuesArray != 0) {
      const dataSet = {
        customData: this.customDataValuesArray,
        customKeys: this.customDataKeysArray,
        submitFlag: 1
      }
      this.dialogRef.close(dataSet);
    }
    else {
      this.service.sweetAlertMsg('error', 'Please select atleast 1 column');
    }
  }


  onDefaultClick() {
    const dataSetDefaultFlag = {
      defaultDataFlag: 1,
      defaultKeys: this.customDataKeysArray,
    }
    this.dialogRef.close(dataSetDefaultFlag);
  }


  onCancel() {
    const dataSetFlag = {
      customDataFlag: 1,
    }
    this.dialogRef.close(dataSetFlag);
  }

  selectColumn(item: any) {
    // Define the array to store the filtered data
    if (item.target.checked == true) {
      let header = item.target.value;
      // if part is used for check of check box and add data in this array  this.customDataKeysArray.
      this.customDataKeysArray.push(header);
      if (this.customDataKeysArray.length >= 11) {
        // Disable the checkbox if customDataKeysArray.length is greater than or equal to 11
        this.disableUncheckedCheckboxes();
      }
    } else {
      // else part is used for uncheck of check box and remove data from this array  this.customDataKeysArray.
      this.customDataKeysArray.splice(this.customDataKeysArray.indexOf(item.target.value), 1);
      // Enable all checkboxes
      this.enableAllCheckboxes();
    }
    this.customDataValuesArray = [];
    this.data.queryData.forEach((dataItem: any) => {
      const filteredJson: any = {};
      this.customDataKeysArray.forEach((key: any) => {
        if (dataItem.hasOwnProperty(key)) {
          filteredJson[key] = dataItem[key];
        }
      });
      this.customDataValuesArray.push(filteredJson);
    });
  }


  disableUncheckedCheckboxes() {
    // Disable unchecked checkboxes when customDataKeysArray.length exceeds 11
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      if (!checkbox.checked) {
        checkbox.disabled = true;
      }
    });
  }



  enableAllCheckboxes() {
    // Enable all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.disabled = false;
    });
  }

}
