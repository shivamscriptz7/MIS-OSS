import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { CellValue, Workbook } from 'exceljs';
import { generate, map } from 'rxjs';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable, { Cell, Column } from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';


import { CommonService } from './common.service';
const exceltype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const CSV_TYPE = 'text/csv;charset=UTF-8';
const CSV_EXTENSION = '.csv';
const reportData = require("config.json");

const EXCEL_EXTENSION = '.xlsx';
const ws = new Workbook();
const logo = 'data:image/png;base64,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'
@Injectable({
  providedIn: 'root'
})
export class ExportSlaExcelService {
  title: any;
  selecteddate: any;
  region: any;
  details: any;
  resultArr = [];
  headerText: any;

  constructor(private http: HttpClient, public service: CommonService
  ) {

  }


  public exportPlanWiseRevenue(res: any, params: any, HeaderName: any): void {
    this.resultArr = res.result;
    let object = JSON.parse(params);


    if (object['Sugarcane'] === 'N') {
      delete object['Sugarcane'];
    }

    var allfabet: any = [];
    Object.keys(object).forEach(key => {
      if (key == 'typeof' || key === "RepoId" || key == 'Circle' || key == 'SSA') {
        delete object[key];
      }




      object['Report_Generate_On'] = moment(new Date()).format('DD-MMM-YYYY');

    });

    for (let j = 0; j < 26; j++) {
      for (let i = 65; i <= 90; i++) {
        if (j == 0) {
          allfabet.push(String.fromCharCode(i));
        } else {
          allfabet.push(allfabet[j - 1] + String.fromCharCode(i))
        }
      }
    }

    //this.headerText = res.result[0].HEADERTEXT;
    let bsnlHeading = "BHARAT SANCHAR NIGAM LIMITED"
    this.headerText = HeaderName;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(this.headerText);// create Worksheet Tab Name

    //merge first cell and last cell of object key  
    worksheet.mergeCells(allfabet[0] + 1, allfabet[Object.keys(this.resultArr[0]).length - 1] + 2);
    worksheet.mergeCells(allfabet[0] + 3, allfabet[Object.keys(this.resultArr[0]).length - 1] + 3);
    worksheet.mergeCells(allfabet[0] + 4, allfabet[Object.keys(this.resultArr[0]).length - 1] + 4);
    worksheet.mergeCells(allfabet[1] + 5, allfabet[Object.keys(this.resultArr[0]).length - 1] + 5);
    worksheet.mergeCells(allfabet[1] + 6, allfabet[Object.keys(this.resultArr[0]).length - 1] + 6);
    worksheet.mergeCells(allfabet[1] + 7, allfabet[Object.keys(this.resultArr[0]).length - 1] + 7);
    worksheet.mergeCells(allfabet[1] + 8, allfabet[Object.keys(this.resultArr[0]).length - 1] + 8);
    worksheet.mergeCells(allfabet[1] + 9, allfabet[Object.keys(this.resultArr[0]).length - 1] + 9);




    //set Header of First Row
    worksheet.getCell(allfabet[0] + 1).value = bsnlHeading;
    worksheet.getCell(allfabet[0] + 4).value = this.headerText;
    // set Allignment of First Row
    worksheet.getCell(allfabet[0] + 1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }

    const imageId2 = workbook.addImage({
      base64: this.service.logoBase64,
      extension: 'png'
    });

    worksheet.addImage(imageId2, 'A1:A4');

    // set font of First Row
    worksheet.getCell(allfabet[0] + 1).font = {
      name: 'Times New Roman',
      size: 18,
      bold: true
    };


    worksheet.getCell(allfabet[0] + 4).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }

    worksheet.getCell(allfabet[0] + 4).font = {
      name: 'Times New Roman',
      size: 14,
      bold: true
    };

    let paramObj = {

      "From": moment(object.FromDate).format('DD-MMM-YYYY'),
      "To": moment(object.ToDate).format('DD-MMM-YYYY')
    }



    if (object.CIRCLE != '') {

      if (object.BA == '') {
        delete object['BA'];
      }

      let setfilterKey = 5;
      Object.keys(object).forEach((key, i) => {
        worksheet.getCell(allfabet[0] + setfilterKey).value = key.replace(/_/g, " ");
        worksheet.getCell(allfabet[0] + setfilterKey).font = { bold: true };
        worksheet.getCell(allfabet[0] + setfilterKey).border = {
          top: { style: 'thin', color: { argb: '0000' } },
          left: { style: 'thin', color: { argb: '0000' } },
          bottom: { style: 'thin', color: { argb: '0000' } },
          right: { style: 'thin', color: { argb: '0000' } }
        };

        setfilterKey++;
      })

      let setExcelfilterValue = 5;
      Object.values(object).forEach((KeyValue: any) => {
        worksheet.getCell(allfabet[1] + setExcelfilterValue).value = KeyValue;
        worksheet.getCell(allfabet[Object.keys(this.resultArr[0]).length - 1] + setExcelfilterValue).border = {
          top: { style: 'thin', color: { argb: '0000' } },
          left: { style: 'thin', color: { argb: '0000' } },
          bottom: { style: 'thin', color: { argb: '0000' } },
          right: { style: 'thin', color: { argb: '0000' } }
        };

        setExcelfilterValue++;
      })



    }






    worksheet.getCell(allfabet[0] + 1).border = {
      top: { style: 'thin', color: { argb: '0000' } },
      left: { style: 'thin', color: { argb: '0000' } },
      bottom: { style: 'thin', color: { argb: '0000' } },
      right: { style: 'thin', color: { argb: '0000' } }
    };
    worksheet.getCell(allfabet[0] + 4).border = {
      top: { style: 'thin', color: { argb: '0000' } },
      left: { style: 'thin', color: { argb: '0000' } },
      bottom: { style: 'thin', color: { argb: '0000' } },
      right: { style: 'thin', color: { argb: '0000' } }
    };


    worksheet.getCell(allfabet[1] + 9).border = {
      top: { style: 'thin', color: { argb: '0000' } },
      left: { style: 'thin', color: { argb: '0000' } },
      bottom: { style: 'thin', color: { argb: '0000' } },
      right: { style: 'thin', color: { argb: '0000' } }
    };


    let headerTextParam = 0;
    // set third row 
    Object.keys(this.resultArr[0]).forEach((RptKey, i) => {

      worksheet.getColumn(++i).width = 18;
      worksheet.getCell(allfabet[0] + i).border = {
        top: { style: 'thin', color: { argb: '0000' } },
        left: { style: 'thin', color: { argb: '0000' } },
        bottom: { style: 'thin', color: { argb: '0000' } },
        right: { style: 'thin', color: { argb: '0000' } }
      };


      if (RptKey != "HEADERTEXT") {
        worksheet.getCell(allfabet[headerTextParam] + 10).value = RptKey;
        headerTextParam++;
        //set third row of excel
        worksheet.getCell(allfabet[i - 1] + 10).font = {
          name: 'Times New Roman',
          color: { argb: '00000' },
          size: 12,
          bold: true
        };

        worksheet.getCell(allfabet[i - 1] + 10).border = {
          top: { style: 'thin', color: { argb: '0000' } },
          left: { style: 'thin', color: { argb: '0000' } },
          bottom: { style: 'thin', color: { argb: '0000' } },
          right: { style: 'thin', color: { argb: '0000' } }
        };

      }
    })



    this.resultArr.forEach((rows, i) => {
      let count = this.resultArr.length;
      let headerTextParam = 0;
      Object.keys(rows).forEach((rowkey, k) => {
        if (rowkey != "HEADERTEXT") {
          worksheet.getCell(allfabet[headerTextParam] + (i + 11)).value = rows[rowkey];
          headerTextParam++;
        }

        //set third row of excel
        worksheet.getCell(allfabet[k] + ((count - 1) + 11)).font = {
          name: 'Times New Roman',
          color: { argb: '00000' },
          // size: 12,
          bold: true
        }


        worksheet.getCell(allfabet[k] + (i + 11)).alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',

        };
        worksheet.getCell(allfabet[k] + (i + 11)).border = {
          top: { style: 'thin', color: { argb: '0000' } },
          left: { style: 'thin', color: { argb: '0000' } },
          bottom: { style: 'thin', color: { argb: '0000' } },
          right: { style: 'thin', color: { argb: '0000' } }
        };
      })

    })





    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: exceltype });
      FileSaver.saveAs(blob, this.headerText + EXCEL_EXTENSION);
    });

  }




  // export  report excel 
  exportExcelFile(json: any[], className: any, excelFileName: any, headername: any, filtersDateString: any, filtersCircleBa: any): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(excelFileName,);
    let header = className;
    let currentDate = moment(new Date()).format('DD-MMM-YYYY');
    let isHeaderPresent: boolean = false;
    for (let colIndex = 1; colIndex <= className.length; colIndex++) {
      worksheet.getColumn(colIndex).width = 15; // You can adjust the default width as needed
    }

    // worksheet.mergeCells('C1:J2');
    // worksheet.mergeCells('C3:J3');
    // worksheet.mergeCells('A4:J4');
    // worksheet.getCell('C1').value = 'BHARAT SANCHAR NIGAM LTD.';
    // worksheet.getCell('C3').value = `${headername}`;
    // // worksheet.getCell('C4').value = `${currentDate}`;

    worksheet.mergeCells('C1:J1');
    worksheet.mergeCells('C2:J3');
    worksheet.mergeCells('C4:J4');
    worksheet.mergeCells('A5:J5');
    worksheet.getCell('C1').value = `Report Generated On : ${currentDate}`;
    worksheet.getCell('C2').value = 'BHARAT SANCHAR NIGAM LTD.';
    worksheet.getCell('C4').value = `${headername}`;
    // worksheet.getCell('C4').value = `${currentDate}`;
    const imageId2 = workbook.addImage({
      base64: this.service.logoBase64,
      extension: 'png'
    });

    worksheet.addImage(imageId2, 'A2:B5');

    let setfilterKey = 6;
    for (let i = 0; i < filtersDateString?.length; i++) {
      if (filtersDateString?.length) {
        if (filtersDateString[i].type == "Date") {
          worksheet.getCell('A' + setfilterKey).value = filtersDateString[i].input.toUpperCase();
          worksheet.getCell('B' + setfilterKey).value = filtersDateString[i].dyncdate;
          setfilterKey++;
        } else {
          worksheet.getCell('A' + setfilterKey).value = filtersDateString[i].input.toUpperCase();
          worksheet.getCell('B' + setfilterKey).value = filtersDateString[i].inputField;
          setfilterKey++;
        }
      }
    }



    let keysFilterCircleBa = Object.keys(filtersCircleBa);
    for (let i = 0; i < keysFilterCircleBa?.length; i++) {
      if (keysFilterCircleBa[i] == "Circle" && filtersCircleBa.Circle) {
        worksheet.getCell('A' + setfilterKey).value = 'CIRCLE';
        worksheet.getCell('B' + setfilterKey).value = filtersCircleBa.Circle;
        setfilterKey++;
      }
      if (keysFilterCircleBa[i] == "BA" && filtersCircleBa.Circle) {
        worksheet.getCell('A' + setfilterKey).value = 'BA';
        worksheet.getCell('B' + setfilterKey).value = filtersCircleBa.BA;
        setfilterKey++;
      }


    }


    worksheet.getCell('A' + setfilterKey)

    for (let x1 of json) {
      if (!isHeaderPresent) {
        isHeaderPresent = true;
        worksheet.addRow(header);
      }
      let temp = [];
      for (let y of className) {
        //temp.push(x1[y]);
        temp.push(x1[y] != null ? x1[y] : ''); // If column is blank, insert an empty string
      }
      worksheet.addRow(temp)
    }
    worksheet.eachRow(function (row, rowNumber) {

      row.eachCell(function (cell, colNumber) {
        if (rowNumber == 1) {
          cell.font = {
            bold: false,
            size: 12
          }

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'right'
          }
        }
        else if (rowNumber == 2 || rowNumber == 3) {
          cell.font = {
            bold: true,
            outline: true,
            size: 15
          }

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
        }
        else if (rowNumber == 4) {
          cell.font = {
            outline: true,
            size: 12,
            bold: true,

          }
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }

        }

        else if (rowNumber == 5) {
          cell.font = {
            bold: true,
            size: 12
          }

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
          }


        } else if (rowNumber == setfilterKey + 1) {
          cell.font = {
            bold: true,
            outline: true,
            size: 11
          }
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          }
        }
        else {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          }
        }
        if (rowNumber > 0) {
          row.getCell(colNumber).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },

          };
        }
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: exceltype });

      FileSaver.saveAs(blob, excelFileName);
    });
  }




  public filterData: any = [];
  //export  REPORT PDF
  public exportAsPdfFile(records: any, reportName: string, headerName: any, filtersDateString: any, filtersCircleBa: any) {
    // USE for current date and time
    let currentDate = moment(new Date()).format('DD-MMM-YYYY');
    let keys = Object.keys(filtersCircleBa);
    let circleKey = '';
    let Bakey = '';

    let columns: any = [];
    let data = records;
    let dataForExcel: any = [];
    columns = Object.keys(records[0])?.slice(0, 11);
    let index = columns.indexOf('user_image');

    records.forEach((row: any) => {
      let values = Object.values(row);
      //values.splice(index, 1)
      dataForExcel.push(values)
    })
    let firstSevenColumns = columns;
    let doc: any;

    let content = '';
    let count = 0;
    let countBreakLine = 0;
    let pixelSize = 1;
    pixelSize = firstSevenColumns.length > 6 ? 170 : 112;
    for (let i = 0; i < filtersDateString?.length; i++) {
      let keyValueString = '';
      if (filtersDateString[i].type == 'Date') {
        keyValueString = filtersDateString[i].input.toUpperCase() + ': ' + filtersDateString[i].dyncdate + '              '
      } else {
        keyValueString = filtersDateString[i].input.toUpperCase() + ': ' + filtersDateString[i].inputField + '              '
      }
      if ((content.length - (countBreakLine * pixelSize)) + keyValueString.length > pixelSize) {
        countBreakLine++;
        content += '\n\n';
        count += 7;
      }
      content += keyValueString;

    }
    count += 2 * Math.floor(content.length / pixelSize);
    if (filtersCircleBa.Circle) {
      if ((content.length - (countBreakLine * pixelSize)) + ('CIRCLE: ' + filtersCircleBa.Circle).length > pixelSize) {
        countBreakLine++;
        content += '\n\n';
        count += 7;
      }
      content += 'CIRCLE: ' + filtersCircleBa.Circle;
    }

    if (filtersCircleBa.BA && filtersCircleBa.Circle) {
      content += '\n\n' + 'BA: ' + filtersCircleBa.BA;
      count += 3 * Math.floor((filtersCircleBa.BA.length + 4) / pixelSize);
    }

    if (firstSevenColumns.length > 6) {
      doc = new jsPDF('landscape');
      // doc = new jsPDF('portrait');
      // for horizontal lines
      doc.line(10, 10, 287.250, 10),
        //used for vertical lines for Ist page pdf
        doc.line(10, 10, 10, 200),

        doc.line(287.20, 10, 287.20, 200),
        //used for middle line of header
        doc.line(10, 34, 287.20, 34)
      doc.line(10, 55 + count, 287.20, 55 + count)
    } else {
      doc = new jsPDF('portrait');
      // for horizontal lines
      doc.line(10, 10, 200, 10),
        //used for vertical lines for Ist page pdf
        doc.line(10, 10, 10, 285),
        doc.line(200, 10, 200, 285),
        //used for middle line of header
        doc.line(10, 34, 200, 34)
      doc.line(10, 55 + count, 200, 55 + count)
    }
    //used for logo
    doc.addImage(reportData.reportlogo, 'PNG', 13, 12, 20, 20, 'alias2', 'NONE', 0);
    // used for 1st heading 
    autoTable(doc, {
      body: [
        [{
          content: reportData.reportHeading,
          styles: {
            halign: 'center',
            fontSize: 15,
            fontStyle: 'bold',
            // cellPadding: { top: },
          }
        },

        ]
      ],
      theme: 'plain',
    });

    // used for 2nd heading
    autoTable(doc, {
      body: [
        [
          {
            content: headerName,
            styles: { fontSize: 13, textColor: '#000', fontStyle: 'bold', halign: 'center', cellPadding: { top: -5 }, }
          },
        ],
        [
          {
            content: `Report Generated On: ${currentDate}`, // Add the second content here
            styles: {
              halign: 'right',
              fontSize: 8,
              fontStyle: 'bold',
              cellPadding: { top: -28, right: 5 }, // Adjust padding as needed
            }
          },
        ],
      ],
      theme: 'plain',
    });


    if (filtersDateString?.lenght != undefined || filtersCircleBa.Circle != '' || filtersDateString?.lenght != null) {
      autoTable(doc, {
        body: [
          [
            {
              content: content,
            },
          ],

        ],
        bodyStyles: { cellPadding: { left: 0 } },

        styles: { cellPadding: 2 },
        startY: 36,
        theme: 'plain',

      });

    }




    //used for show column name and data
    autoTable(doc, {
      head: [firstSevenColumns],
      headStyles: { fillColor: [24, 50, 72], fontSize: 6 },
      body: dataForExcel,
      bodyStyles: { cellPadding: { left: 2, top: 2, } },
      margin: { left: 10, right: 10.2 },
    });
    this.pageDesc(doc, firstSevenColumns?.length);
    doc.save(`${reportName}_export_${new Date().getTime()}.pdf`);
  }


  pageDesc(doc: any, size: any) {
    //get no. of pages pdf
    let length = doc.internal.getNumberOfPages();

    for (let i = 1; i <= length; i++) {
      doc.setPage(i)
      doc.setDrawColor(0, 0, 0)
      if (size > 6) {
        //used for dynamic vertical lines each page
        doc.line(10, 14, 10, 200)

        doc.line(287.20, 14, 287.20, 200),

          //used for dynamic horizontal lines each page
          doc.line(10, 200, 287.20, 200)

      } else {
        //used for dynamic vertical lines each page
        doc.line(10, 14, 10, 285)

        doc.line(200, 14, 200, 285),

          //used for dynamic horizontal lines each page
          doc.line(10, 285, 200, 285)
      }


      //used for show page number in pdf
      doc.setFontSize(8)
      doc.text('Page ' + String(i) + ' of ' + String(length), (size > 6 ? 273.20 : 185), doc.internal.pageSize.height - 5)

    }
  }


  //Rahul New code

  public fileName: any;
  public repoType: any;
  public slaPdfDownload(param: any, path: any, reportName: any) {
    if (param == "PDFDATA" || param == "HTML" || param == "EXCEL" || param == "CSV") {
      FileSaver.saveAs(path, reportName);
    }
    // else if (param == "HTML") {
    //   FileSaver.saveAs(path, reportName);
    // } else if (param == "EXCEL") {
    //   FileSaver.saveAs(path, reportName);
    // }
  }



  public exportAsCsvFile(json: any[], csvFileName: string, callback = null) {
    const csvContent = this.convertJsonToCsv(json);
    const data: Blob = new Blob([csvContent], {
      type: CSV_TYPE //CSV_TYPE = 'text/csv;charset=UTF-8'
    });
    FileSaver.saveAs(data, csvFileName + '_export_' + new Date().getTime() + CSV_EXTENSION); // CSV_EXTENSION = '.csv'
  }

  private convertJsonToCsv(json: any[]): string {
    const csvRows = [];
    // Extract headers from the first object in the JSON array
    const headers = Object.keys(json[0]);
    // Add headers to the CSV content
    csvRows.push(headers.join(','));

    // Convert JSON data to CSV rows
    for (const item of json) {
      const values = headers.map(header => item[header]);
      csvRows.push(values.join(','));
    }

    // Join CSV rows with newline characters to create the final CSV content
    return csvRows.join('\n');
  }



  public SLRexportAsCsvFile(json: any[], csvFileName: string, callback = null) {
    //return;
    const csvContent = this.SLRconvertJsonToCsv(json);
    const data: Blob = new Blob([csvContent], {
      type: CSV_TYPE //CSV_TYPE = 'text/csv;charset=UTF-8'
    });
    FileSaver.saveAs(data, csvFileName + '_export_' + new Date().getTime() + CSV_EXTENSION); // CSV_EXTENSION = '.csv'
  }

  private SLRconvertJsonToCsv(json: any[]): string {
    const csvRows = [];
    // Extract headers from the first object in the JSON array
    const headers = Object.keys(json[0]);
    // Add headers to the CSV content
    csvRows.push(headers.join(','));

    // Convert JSON data to CSV rows
    for (const item of json) {
      const values = headers.map(header => item[header]);
      csvRows.push(values.join(','));
    }

    // Join CSV rows with newline characters to create the final CSV content
    return csvRows.join('\n');
  }



  //used for logs

  public exportAsPdfFileLogs(records: any, filterData: any, headerName: any) {



    let reportlogsData = headerName;
    let circleKey = '';
    let Bakey = '';

    let columns: any = [];
    let data = records;
    let dataForExcel: any = [];
    columns = Object?.keys(records[0])?.slice(0, 11);
    let index = columns.indexOf('user_image');

    records.forEach((row: any) => {
      let values = Object.values(row);
      //values.splice(index, 1)
      dataForExcel.push(values);
    })
    //let firstSevenData = dataForExcel.slice(0, 10);
    //columns.splice(index, 1);
    let firstSevenColumns = columns;
    let doc: any;

    let content = '';
    let count = 0;
    let countBreakLine = 0;
    let pixelSize = 1;
    pixelSize = firstSevenColumns.length > 6 ? 170 : 112;

    let objectFilter: any = {
      "From Date": filterData.fromDt,
      "To Date": filterData.toDt,
      "Log Action": filterData.logAction,
      "Username": filterData.userId,
      "Type": filterData.type,

    }

    Object.keys(objectFilter).forEach((key) => {
      let keyValueString = '';
      if (objectFilter[key]) {
        keyValueString = key.toUpperCase() + ': ' + objectFilter[key] + '              '
      }
      if ((content.length - (countBreakLine * pixelSize)) + keyValueString.length > pixelSize) {
        countBreakLine++;
        content += '\n\n';
        count += 7;
      }
      content += keyValueString;
    });


    if (firstSevenColumns.length > 6) {
      doc = new jsPDF('landscape');
      // doc = new jsPDF('portrait');
      // for horizontal lines
      doc.line(10, 10, 287.250, 10),
        //used for vertical lines for Ist page pdf
        doc.line(10, 10, 10, 200),

        doc.line(287.20, 10, 287.20, 200),
        //used for middle line of header
        doc.line(10, 34, 287.20, 34)
      doc.line(10, 55 + count, 287.20, 55 + count)
    } else {
      doc = new jsPDF('portrait');
      // for horizontal lines
      doc.line(10, 10, 200, 10),
        //used for vertical lines for Ist page pdf
        doc.line(10, 10, 10, 285),
        doc.line(200, 10, 200, 285),
        //used for middle line of header
        doc.line(10, 34, 200, 34)
      doc.line(10, 55 + count, 200, 55 + count)
    }

    //used for logo
    doc.addImage(reportData.reportlogo, 'PNG', 13, 12, 20, 20, 'alias2', 'NONE', 0);


    // used for Ist heading 
    autoTable(doc, {
      body: [
        [{
          content: reportData.reportHeading,
          styles: {
            halign: 'center',
            fontSize: 15,
            fontStyle: 'bold',
            // cellPadding: { top: },
          }
        },
        ]
      ],
      theme: 'plain',
    });

    // used for 2nd heading
    autoTable(doc, {
      body: [
        [
          {
            content: headerName + " Logs",
            styles: { fontSize: 13, textColor: '#000', fontStyle: 'bold', halign: 'center', cellPadding: { top: -5 }, }
          },
        ]
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: content,
          },
        ],

      ],
      bodyStyles: { cellPadding: { left: 0 } },

      styles: { cellPadding: 2 },
      startY: 38,
      theme: 'plain',

    });

    //used for show column name and data
    autoTable(doc, {
      head: [firstSevenColumns],
      headStyles: { fillColor: [24, 50, 72], fontSize: 6 },
      body: dataForExcel,
      bodyStyles: { cellPadding: { left: 2, top: 2, } },
      margin: { left: 10, right: 10.2 },
    });
    this.pageDesc(doc, firstSevenColumns?.length);
    doc.save(`${reportlogsData}_export_${new Date().getTime()}.pdf`);
  }




  // export  report excel 
  exportExcelFileLogs(json: any[], className: any, filtersData: any, excelFileName: any): void {



    let objectFilter = {
      "From Date": filtersData.fromDt,
      "To Date": filtersData.toDt,
      "Log Action": filtersData.logAction,
      "Username": filtersData.userId,
      "Type": filtersData.type,

    }
    // let filterObj = JSON.parse(filtersData)
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(excelFileName,);
    let header = className;

    //return;

    let isHeaderPresent: boolean = false;
    for (let colIndex = 1; colIndex <= className.length; colIndex++) {
      worksheet.getColumn(colIndex).width = 15; // You can adjust the default width as needed
    }

    worksheet.mergeCells('C1:J2');
    worksheet.mergeCells('C3:J3');
    worksheet.mergeCells('A4:J4');
    worksheet.getCell('C1').value = 'BHARAT SANCHAR NIGAM LTD.';
    worksheet.getCell('C3').value = excelFileName + " Logs";

    const imageId2 = workbook.addImage({
      base64: this.service.logoBase64,
      extension: 'png'
    });

    worksheet.addImage(imageId2, 'A1:B4');




    let setfilterKeydata = 6;

    // if (filtersData.fromDt != "") {
    const entries = Object.entries(objectFilter);
    entries.forEach(([key, value]) => {
      // Ensure the types are correctly inferred or cast
      if (value) {
        worksheet.getCell('A' + setfilterKeydata).value = key;
        worksheet.getCell('B' + setfilterKeydata).value = value;
        setfilterKeydata++;
      }
    });

    // }





    //worksheet.getCell('A' + setfilterKey)
    let keyData = setfilterKeydata
    for (let x1 of json) {
      // let x2 = Object.keys(x1);
      if (!isHeaderPresent) {
        isHeaderPresent = true;
        worksheet.addRow(header);
      }
      let temp = [];
      for (let y of className) {
        //temp.push(x1[y]);
        temp.push(x1[y] != null ? x1[y] : ''); // If column is blank, insert an empty string
      }
      worksheet.addRow(temp)
    }
    worksheet.eachRow(function (row, rowNumber) {

      row.eachCell(function (cell, colNumber) {

        if (rowNumber == 1 || rowNumber == 2) {
          cell.font = {
            bold: true,
            size: 16
          }

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
        } else if (rowNumber == 3) {
          cell.font = {
            outline: true,
            size: 12
          }

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }


        }
        else if (rowNumber == setfilterKeydata) {
          cell.font = {
            bold: true,
            outline: true,
            size: 11
          }
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          }
        }

        if (rowNumber > 0) {
          row.getCell(colNumber).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },

          };
        }
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: exceltype });

      FileSaver.saveAs(blob, excelFileName + '_Logs');
    });
  }










}
