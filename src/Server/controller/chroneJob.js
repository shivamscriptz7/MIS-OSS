/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 29/08/2023
 * Author:Kajal Gulyani
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */

const chronjobModule = {};
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const connection = require('../CommonFiles/connection').dbConnection;
const oracledb = require('oracledb');
const commonFunction = require('../CommonFiles/commonFunction');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const getSchedulApi = require('../controller/operationController');

const logo = require('../../../config.json');
const ExelJs = require('exceljs');
const { log } = require('console');
const { now } = require('underscore');
const moment = require('moment');

var dbCon;
var scheduleJOBList = [];
var myCon = connection.then((connection) => {
    dbCon = connection;
});
// Create a Nodemailer transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pankaj.singh.echelonedge@gmail.com',
        pass: 'pkxoggaclhttihwe'
    }
});

// used for stop cron job
chronjobModule.stopCronJob = (CURRENT_STATUS, NewRepoId, USER_ID, flag) => {
    scheduleJOBList.forEach((ele) => {
        if (ele.repo_id == NewRepoId) {
            let StopJob = ele.job;
            StopJob.cancel();
        }
    })
}

let excelFileGenerate;
let pdfFileGenerate;
let csvFileGenerate;
let catchError;
let emailSendingError;
// used for job execution
chronjobModule.jobExecute = (repo_query, current_flag, data, scheduleTime, REPORT_NAME, REPORT_FORMAT, REPO_ID, USER_EMAILS, USER_ID, REPO_HEADER, PROCESS_TYPE, REPORT_QUERY, LATEST_STATUS, REPORT_PATH) => {
    // let myjob = schedule.scheduleJob(scheduleTime, async () => {
    //     try {
    //         // Start by updating the execution status to 'In Progress'
    //         const now = new Date();
    //         const year = now.getFullYear();
    //         const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Pad month with leading zero if necessary
    //         const monthYearDir = `${month}_${year}`;

    //         const uploadsDir = path.join(__dirname, `../../../uploads/${REPORT_PATH}/${monthYearDir}`);
    //         const reportPath = path.join(uploadsDir, REPORT_PATH);

    //         // Create the REPORT_PATH directory if it doesn't exist
    //         if (!fs.existsSync(uploadsDir)) {
    //             fs.mkdirSync(uploadsDir, { recursive: true });
    //         }


    //         await updateExecStatus('In Progress', REPO_ID, 1, -1);
    //         const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
    //         const fileName = `${REPORT_NAME}_${currentDateTime}`;
    //         const finalResult = await getQueryResult(repo_query, PROCESS_TYPE);

    //         // Now you can use finalResult for further processing
    //         if (data[0]?.ERR) {
    //             console.log('Err');
    //             // If there is an error, update the report status accordingly
    //             await addReportStatus('Error', REPO_ID, USER_ID, fileName, data[0].ERR, REPORT_FORMAT, 0);
    //         } else {
    //             if (LATEST_STATUS === 1) {
    //                 console.log('File generation skipped due to current scheduler is in Execution state.');
    //             } else {
    //                 const repoformats = REPORT_FORMAT.split(',');
    //                 const reportPath = [];
    //                 let allFilesGenerated = false;
    //                 for (const format of repoformats) {
    //                     let filePath;
    //                     if (format.trim() === 'xlsx') {
    //                         filePath = `${uploadsDir}/${fileName}.xlsx`;
    //                         exportExcel(filePath, finalResult, REPO_ID.toString(), USER_ID, REPORT_NAME, REPO_HEADER);
    //                         allFilesGenerated = true;
    //                     }
    //                     if (format.trim() === 'csv') {
    //                         filePath = `${uploadsDir}/${fileName}.csv`;
    //                         //filePath = path.join(__dirname, `../../../uploads/${fileName}.csv`);
    //                         exportCSV(filePath, finalResult, REPO_ID.toString(), USER_ID, REPORT_NAME);
    //                         allFilesGenerated = true;
    //                     }
    //                     if (format.trim() === 'Pdf') {
    //                         filePath = `${uploadsDir}/${fileName}.pdf`;
    //                         //filePath = path.join(__dirname, `../../../uploads/${fileName}.pdf`);
    //                         exportPDF(filePath, finalResult, REPORT_NAME, REPO_ID.toString(), USER_ID, REPO_HEADER);
    //                         allFilesGenerated = true;
    //                     }
    //                     reportPath.push(filePath);
    //                 }
    //                 if (allFilesGenerated) {
    //                     // If all files are generated successfully, update report status to 'Ready'
    //                     addReportStatus('Ready', REPO_ID, USER_ID, fileName, '', repoformats.toString(), 0);
    //                     if (USER_EMAILS != null && USER_EMAILS != '') {
    //                         sendMail(USER_EMAILS, REPORT_NAME, reportPath, repoformats, REPO_ID, USER_ID);
    //                     }
    //                     addReportDetails(reportPath.toString(), REPORT_NAME, 'Ready', REPO_ID);
    //                 } else {
    //                     // If any file generation fails, update report status to 'Error'
    //                     addReportStatus('Error', REPO_ID, USER_ID, fileName, catchError, '', 0);

    //                 }

    //             }

    //         }
    //     } catch (error) {
    //         // Handle any unexpected errors and update report status accordingly
    //         console.error(error);
    //         addReportStatus('Error', REPO_ID, USER_ID, fileName, 'Unexpected error occurred', REPORT_FORMAT, 0);
    //     }
    // });
    // scheduleJOBList.push({ 'repo_id': REPO_ID, 'job': myjob });

}
// function used for send Email
function sendMail(USER_EMAILS, REPORT_NAME, filePath, repoformats, REPO_ID, USER_ID) {
    const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
    const fileName = `${REPORT_NAME}_${currentDateTime}`;
    const mailOptions = {
        from: 'pankaj.singh.echelonedge@gmail.com',
        to: USER_EMAILS,
        // subject: options.subject,
        // html: options.html
        subject: 'Report Ready',
        text: `The report ${REPORT_NAME} is ready for download. Please find it attached.`,
        attachments: []
    };
    for (let i = 0; i < filePath.length; i++) {
        mailOptions.attachments.push({
            filename: `${REPORT_NAME}.${repoformats[i]}`,
            path: filePath[i]

        });

    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            emailSendingError = false;
            addReportStatus('Error', REPO_ID, USER_ID, fileName, error ? JSON.stringify(error) : '', null);
            console.error('Error sending email:', error);
        } else {
            emailSendingError = true;
            console.log('Email sent:', info.response);
        }


    });
}


// function used for export data as excel
function exportExcel(filePath, data, REPO_ID, USER_ID, REPORT_NAME, REPO_HEADER) {

    // const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    try {
        let currentDate = moment(new Date()).format('DD-MMM-YYYY');
        data.forEach((element) => {
            className = Object.keys((element));
        });
        const workbook = new ExelJs.Workbook();
        // let workbook = new Workbook();

        let worksheet = workbook.addWorksheet('Sheet-1');
        // const worksheet = workbook.addWorksheet();
        let header = className;

        let isHeaderPresent = false;
        worksheet.getColumn(1).width = 10;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 15;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 23;
        worksheet.getColumn(7).width = 15;
        worksheet.getColumn(8).width = 15;
        worksheet.getColumn(9).width = 25;
        worksheet.getColumn(10).width = 38;
        worksheet.mergeCells('C1:J1');
        worksheet.mergeCells('C2:J3');
        worksheet.mergeCells('C4:J4');
        worksheet.mergeCells('A5:J5');
        worksheet.getCell('C1').value = `Report Generated On : ${currentDate}`;
        worksheet.getCell('C2').value = 'BHARAT SANCHAR NIGAM LTD.';
        worksheet.getCell('C4').value = REPO_HEADER;
        // worksheet.mergeCells('C1:J2');
        // worksheet.mergeCells('C3:J3');
        // worksheet.mergeCells('A4:J4');
        // worksheet.getCell('C1').value = 'BHARAT SANCHAR NIGAM LTD.';
        // worksheet.getCell('C3').value = REPO_HEADER;

        const imageId2 = workbook.addImage({
            base64: logo.reportlogo,
            extension: 'png'
        });

        worksheet.addImage(imageId2, 'A1:B4');

        for (let x1 of data) {
            // let x2 = Object.keys(x1);
            if (!isHeaderPresent) {
                isHeaderPresent = true;
                worksheet.addRow(header);
            }
            let temp = [];
            for (let y of className) {
                temp.push(x1[y]);
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
                } else if (rowNumber == 2 || rowNumber == 3) {
                    cell.font = {
                        outline: true,
                        bold: true,
                        size: 16
                    }

                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center'
                    }


                } else if (rowNumber == 4) {
                    cell.font = {
                        bold: true,
                        size: 12
                    }

                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center',
                    }


                } else if (rowNumber == 5) {
                    cell.font = {
                        bold: true,
                        outline: true,
                        size: 10
                    }
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center'
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

        // workbook.xlsx.writeBuffer().then((data) => {
        //     let blob = new Blob([data], { type: exceltype });

        //     FileSaver.saveAs(blob, excelFileName);
        // });


        // Save the workbook to a file
        workbook.xlsx.writeFile(filePath).then(() => { console.log('Excel file saved successfully.'); }).catch((error) => { console.error('Error creating Excel file:', error); });
        // workbook.xlsx.writeFile()


        // console.log('Excel file saved successfully.');

        // XLSX.writeFile(workbook, filePath);
        // excelFileGenerate = true;
        // console.log('Excel file saved successfully.');
    }
    catch (err) {
        excelFileGenerate = false;
        catchError = err;
        console.error('Error saving Excel file:', err);
    }
}
// function used for export as pdf
function exportPDF(filePath, data, REPORT_NAME, REPO_ID, USER_ID, REPO_HEADER) {
    try {
        // USE for current date and time
        let currentDate = moment(new Date()).format('DD-MMM-YYYY');
        const logoBase64 = "data:image/jpeg;base64,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"

        const firstSevenColumns = Object.keys(data[0]).slice(0, 11);
        let doc;
        let dataForExcel = [];

        data.forEach((row) => {
            let values = Object.values(row);
            dataForExcel.push(values)
        })

        if (firstSevenColumns.length > 6) {
            doc = new jsPDF('landscape');
            // for horizontal lines
            doc.line(10, 10, 287.250, 10),
                //used for vertical lines for Ist page pdf
                doc.line(10, 10, 10, 200),
                doc.line(287.20, 10, 287.20, 200),
                //used for middle line of header
                doc.line(10, 34, 287.20, 34)
        } else {
            doc = new jsPDF('portrait');
            // for horizontal lines
            doc.line(10, 10, 200, 10),
                //used for vertical lines for Ist page pdf
                doc.line(10, 10, 10, 285),
                doc.line(200, 10, 200, 285),
                //used for middle line of header
                doc.line(10, 34, 200, 34)
        }
        let reportHeaderName = REPO_HEADER;
        //used for logo
        doc.addImage(logoBase64, 'PNG', 13, 12, 20, 20, 'alias2', 'NONE', 0);


        // used for Ist heading 
        doc.autoTable({
            body: [
                [{
                    content: 'BHARAT SANCHAR NIGAM LTD',
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
        doc.autoTable({
            body: [
                [
                    {
                        content: reportHeaderName,
                        styles: { fontSize: 13, textColor: '#000', fontStyle: 'bold', halign: 'center', cellPadding: { top: -5 }, }
                    },
                ], [
                    {
                        content: `Report created on: ${currentDate}`, // Add the second content here
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


        // used for show column name and data
        doc.autoTable({
            head: [firstSevenColumns],
            headStyles: { fillColor: [24, 50, 72], fontSize: 6 },
            body: dataForExcel,
            bodyStyles: { cellPadding: { left: 2, top: 2, } },
            margin: { left: 10, right: 10.2 },
        });

        pageDesc(doc, firstSevenColumns?.length);
        var PdfData = doc.output();
        fs.writeFileSync(filePath, PdfData, 'binary');
        console.log('pdf generated');

        pdfFileGenerate = true;
    }
    catch (error) {
        pdfFileGenerate = false;
        catchError = error;
        console.log("catch error", error);

    }
}
function pageDesc(doc, size) {
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

function exportCSV(filePath, data, REPO_ID, USER_ID, REPORT_NAME) {
    const csvWriter = createCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
    });

    csvWriter.writeRecords(data)
        .then(() => {
            console.log('CSV file has been written successfully.');
            csvFileGenerate = true;
        })
        .catch((err) => {
            csvFileGenerate = false;
            catchError = err;
            console.error('Error writing CSV file:', err);
        });
}

// used for update status and path of report in db
async function addReportDetails(reportPath, reportName, reportStatus, repoId) {
    try {
        const result = await dbCon.execute(
            `BEGIN UPDATE_REPORT_SCHEDULE_DETAILS(:REPORT_ID,:REPORT_PATH,:REPORT_NAME,:REPORT_STATUS,:CUR_DATA);END;`,
            {
                REPORT_ID: { dir: oracledb.BIND_IN, val: repoId },
                REPORT_PATH: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reportPath },
                REPORT_NAME: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reportName },
                REPORT_STATUS: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reportStatus },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        // if (finalData[0].ERR == 'X') {
        //     res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
        // } else {
        //     res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
        //     executeBillingQuery(finalData[0].REPO_QUERY.toString().replace(';', '').trim(), req.body.SCHEDULE_TIME, finalData[0].REPORT_NAME, req.body.REPO_FORMAT);
        // }

    } catch (error) {
        console.log(error, 'err')
        // res.end(commonFunction.getErrorResponse(error));
    }
}
// used for update status  of report in db
async function addReportStatus(reportStatus, repoId, user_id, fileName, catchError, reportFormats, executionStatus) {
    try {
        const result = await dbCon.execute(

            `BEGIN ADD_REPORT_STATUS(:REPORT_STATUS,:REPORT_ID,:USER_ID,:REPORT_NAME,:ERROR_MSG,:REPORT_FORMAT,:EXECUTION_STATUS,:CUR_DATA);END;`,
            {
                REPORT_STATUS: { dir: oracledb.BIND_IN, val: reportStatus },
                REPORT_ID: { dir: oracledb.BIND_IN, val: repoId },
                USER_ID: { dir: oracledb.BIND_IN, val: user_id },
                REPORT_NAME: { dir: oracledb.BIND_IN, val: fileName },
                ERROR_MSG: { dir: oracledb.BIND_IN, val: catchError ? JSON.stringify(catchError) : null },
                REPORT_FORMAT: { dir: oracledb.BIND_IN, val: reportFormats },
                EXECUTION_STATUS: { dir: oracledb.BIND_IN, val: executionStatus },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        // if (finalData[0].ERR == 'X') {
        //     res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
        // } else {
        //     res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
        //     executeBillingQuery(finalData[0].REPO_QUERY.toString().replace(';', '').trim(), req.body.SCHEDULE_TIME, finalData[0].REPORT_NAME, req.body.REPO_FORMAT);
        // }

    } catch (error) {
        console.log(error, 'err')
        // res.end(commonFunction.getErrorResponse(error));
    }
}


// used for update status  of report in db
async function updateExecStatus(reportStatus, repoId, executionStatus, currentStatus) {
    try {
        const result = await dbCon.execute(

            `BEGIN ADD_SCHEDULE_STATUS(:REPORT_STATUS,:REPORT_ID,:EXECUTION_STATUS,:CURRENT_STATUS,:CUR_DATA);END;`,
            // `BEGIN ADD_SCHEDULE_STATUS(:REPORT_ID,:EXECUTION_STATUS,:CURRENT_STATUS,:CUR_DATA);END;`,
            {
                REPORT_STATUS: { dir: oracledb.BIND_IN, val: reportStatus },
                REPORT_ID: { dir: oracledb.BIND_IN, val: repoId },
                // USER_ID: { dir: oracledb.BIND_IN, val: user_id },
                // REPORT_NAME: { dir: oracledb.BIND_IN, val: fileName },
                //// ERROR_MSG: { dir: oracledb.BIND_IN, val: catchError ? JSON.stringify(catchError) : null },
                // REPORT_FORMAT: { dir: oracledb.BIND_IN, val: reportFormats },
                EXECUTION_STATUS: { dir: oracledb.BIND_IN, val: executionStatus },
                CURRENT_STATUS: { dir: oracledb.BIND_IN, val: currentStatus },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
    } catch (error) {
        console.log(error, 'err')
        // res.end(commonFunction.getErrorResponse(error));
    }
}

//  for job execute manual
chronjobModule.executeJobManually = async (repo_query, current_flag, data, scheduleTime, REPORT_NAME, REPORT_FORMAT, REPO_ID, USER_EMAILS, PROCESS_TYPE, USER_ID, REPO_HEADER, REPORT_PATH) => {

    const repoformats = REPORT_FORMAT.split(',');
    const reportPath = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Pad month with leading zero if necessary
    const monthYearDir = `${month}_${year}`;

    const uploadsDir = path.join(__dirname, `../../../uploads/${REPORT_PATH}/${monthYearDir}`);
    //const reportPath = path.join(uploadsDir, REPORT_PATH);

    // Create the REPORT_PATH directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    let allFilesGenerated = false;
    const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
    const fileName = `${REPORT_NAME}_${currentDateTime}`;
    // addReportStatus('Readyoup', REPO_ID, USER_ID, fileName, '', repoformats.toString(), 11);
    const finalResult = await getQueryResult(repo_query, PROCESS_TYPE);
    if (data[0]?.ERR) {
        // use for set status ReExeError in re-execution in report_status table
        addReportStatus('ReExeError', REPO_ID, USER_ID, fileName, data[0].ERR, REPORT_FORMAT, 1);
    } else {
        for (const format of repoformats) {
            let filePath, reportFilePath;
            if (format.trim() === 'xlsx') {
                filePath = `${uploadsDir}/${fileName}.xlsx`;
                //filePath = path.join(__dirname, `../../../uploads/${fileName}.xlsx`);
                exportExcel(filePath, finalResult, REPO_ID.toString(), USER_ID, REPORT_NAME, REPO_HEADER);
                allFilesGenerated = true;
            }
            if (format.trim() === 'csv') {
                filePath = `${uploadsDir}/${fileName}.csv`;
                //filePath = path.join(__dirname, `../../../uploads/${fileName}.csv`);
                exportCSV(filePath, finalResult, REPO_ID.toString(), USER_ID, REPORT_NAME);
                allFilesGenerated = true;
            }
            if (format.trim() === 'Pdf') {
                filePath = `${uploadsDir}/${fileName}.pdf`;
                //filePath = path.join(__dirname, `../../../uploads/${fileName}.pdf`);
                exportPDF(filePath, finalResult, REPORT_NAME, REPO_ID.toString(), USER_ID, REPO_HEADER);
                allFilesGenerated = true;

            }
            reportPath.push(filePath);

        }


        if (USER_EMAILS != null && USER_EMAILS != '') {
            sendMail(USER_EMAILS, REPORT_NAME, reportPath, repoformats, REPO_ID, USER_ID);
        }
        addReportDetails(reportPath.toString(), REPORT_NAME, 'Ready', REPO_ID);
        if (emailSendingError != false) {
            if (excelFileGenerate != false && pdfFileGenerate != false && csvFileGenerate != false) {
                addReportStatus('ReExeReady', REPO_ID, USER_ID, fileName, '', repoformats.toString(), 0);
            } else {
                addReportStatus('ReExeError', REPO_ID, USER_ID, fileName, catchError, '', 0);
            }
        }
    }




}












// GET query data 

async function getQueryResult(repo_query, PROCESS_TYPE) {
    try {
        const result = await dbCon.execute(
            `BEGIN get_billing_reports(:report_query,:p_type,:my_cursor);END;`,
            {
                report_query: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repo_query },
                p_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: PROCESS_TYPE },
                my_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return commonFunction.getResultSetManually(result.outBinds.my_cursor);

    } catch (error) {
        console.log(error, 'err')
    }
}

module.exports = { chronjobModule };