/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 29/08/2023
 * Author:Rahul Kumar
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */
const connection = require('../CommonFiles/connection').dbConnection;
const operationCtrl = {};
const oracledb = require('oracledb');
const commonFunction = require('../CommonFiles/commonFunction');
const chroneJob = require('../controller/chroneJob');
const { async } = require('rxjs');
const CryptoJS = require("crypto-js");
const sceretEncrypt_Decryptkey = require('../../../config.json');
var dbCon;
// var myCon = connection.then((connection) => {
//     dbCon = connection;
// });

//console.log(myCon, "myCon");
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(echelonedge.com)$/
operationCtrl.customValidations = (req, res, validation_obj) => {

    for (let i = 0; i < validation_obj.length; i++) {

        //check key is available or not in req.body
        if (req.body[Object.keys(validation_obj[i])]) {
            let bodyVaule = req.body[Object.keys(validation_obj[i])];
            if (typeof Object.values(validation_obj[i])[0][2] == typeof bodyVaule) {
                if (!Object.values(validation_obj[i])[0][0].test(typeof bodyVaule == typeof "" ? bodyVaule?.trim() : bodyVaule)) {
                    return ([{ ERR: 'X', MSG: "Enter " + Object.keys(validation_obj[i]) + " valid data." }]);
                }
            } else {
                return ([{ ERR: 'X', MSG: Object.keys(validation_obj[i]) + " Should be in " + typeof Object.values(validation_obj[i])[0][2] + " format." }]);
            }
            //check regex with req.body

        } else {
            //check required fields
            if (Object.values(validation_obj[i])[0][1] == 1) {
                return ([{ ERR: 'X', MSG: Object.keys(validation_obj[i]) + " is required field." }]);
            }
        }
    }
    return 0;

}

operationCtrl.customValidations_EncryptSchedule = (req, res, validation_obj) => {

    for (let i = 0; i < validation_obj.length; i++) {

        //check key is available or not in req.body
        if (req[Object.keys(validation_obj[i])]) {
            let bodyVaule = req[Object.keys(validation_obj[i])];
            if (typeof Object.values(validation_obj[i])[0][2] == typeof bodyVaule) {
                if (!Object.values(validation_obj[i])[0][0].test(typeof bodyVaule == typeof "" ? bodyVaule?.trim() : bodyVaule)) {
                    return ([{ ERR: 'X', MSG: "Enter " + Object.keys(validation_obj[i]) + " valid data." }]);
                }
            } else {
                return ([{ ERR: 'X', MSG: Object.keys(validation_obj[i]) + " Should be in " + typeof Object.values(validation_obj[i])[0][2] + " format." }]);
            }
            //check regex with req.body

        } else {
            //check required fields
            if (Object.values(validation_obj[i])[0][1] == 1) {
                return ([{ ERR: 'X', MSG: Object.keys(validation_obj[i]) + " is required field." }]);
            }
        }
    }
    return 0;

}

// this method used for schedule reports list
operationCtrl.getReportListSchedule = async (req, res) => {
    try {
        let user_id = parseInt(req.query.user_id);
        let scheduledId = parseInt(req.query.scheduledId);
        if (!req.query.scheduledId) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "schedule id is required." }]));
        } else if (!user_id) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "user id is required." }]));
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_SCHEDULE_REPORTS(:P_SCHEDULED_ID,:P_USER_ID,:CUR_DATA); END;`,
                {
                    P_SCHEDULED_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: scheduledId },
                    P_USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: user_id },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (finalData) {
                res.end(commonFunction.getSuccessResponse(finalData, ''));
            } else {
                res.end(commonFunction.getErrorResponse(finalData.err));
            }
        }


    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}



// used for update status  of report in db
async function updateExecStatus(schedStatus, repoId, executionStatus, currentStatus) {
    try {
        const result = await dbCon.execute(

            `BEGIN ADD_SCHEDULE_STATUS(:REPORT_STATUS,:REPORT_ID,:EXECUTION_STATUS,:CURRENT_STATUS,:CUR_DATA);END;`,
            {
                REPORT_STATUS: { dir: oracledb.BIND_IN, val: schedStatus },
                REPORT_ID: { dir: oracledb.BIND_IN, val: repoId },
                EXECUTION_STATUS: { dir: oracledb.BIND_IN, val: executionStatus },
                CURRENT_STATUS: { dir: oracledb.BIND_IN, val: currentStatus },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
    } catch (error) {
        console.log(error, 'err')
    }
}

// used for exceute schedule manually
operationCtrl.exceuteScheduleManually = async (req, res) => {
    // addScheduleStatus(-1, 133);
    if (req.body.STATUS === 0) {
        updateExecStatus('In Progress', req.body.REPORT_ID, 1, -1);
        try {
            let SCHEDULE_TIME = '* * * * *';

            executeSchduleManually(req.body.QUERY.replace(';', '').trim(), SCHEDULE_TIME, req.body.REPO_NAME,
                req.body.SCH_REPO_FORMAT, req.body.REPORT_ID, req.body.CURRENT_STATUS, req.body.USER_EMAILS,
                req.body.PROCESS_TYPE, req.payload.USER_ID, req.body.REPO_HEADER, req.body.REPORT_PATH, req.body.EMAIL_CONFIG);

        } catch (error) {
            console.log(error, 'error');
        }
        res.end(commonFunction.getSuccessResponse({ ERR: '', MSG: 'Execute Successfully' }));

    } else {
        res.end(commonFunction.getSuccessResponse({ ERR: 'X', MSG: 'Disabled' }));

    }

}


// used for add update schedule form 
operationCtrl.addUpdateSchedule = async (req, res) => {
    try {

        let scheduleData = CryptoJS.AES.decrypt(req.body.obj, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let parseScheduleData = JSON.parse(scheduleData);
        let emailValidationFlag = 0;
        if (parseScheduleData.MAIL_CHECKBOX == true) {
            emailValidationFlag = 1;
            // return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "MAIL_CHECKBOX Or Email  should not be null." }));
        }

        let scheduleTime = parseScheduleData.SCHEDULED_TIME1.includes('*');

        if (scheduleTime === true) {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "No changes to update." }));
        }

        // use for get user id from user  headers.authorization
        let userAuthorization = parseJwt(req.headers.authorization);
        let userId = userAuthorization.USER_ID;

        let userPerm = CryptoJS.AES.decrypt(req.headers.permission, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);

        let module = parsedModules.filter((item) =>
            item.module_id === 9);
        emialString = '';
        const emailList = parseScheduleData.SENDER_EMAIL?.forEach((e, i) => {
            if (i == parseScheduleData.SENDER_EMAIL.length - 1) {
                emialString += e;
            } else {
                emialString += e + ',';
            }
        });

        let mailCheckBox = null;
        if (parseScheduleData.MAIL_CHECKBOX == '' || parseScheduleData.MAIL_CHECKBOX == null || parseScheduleData.MAIL_CHECKBOX == 0 || parseScheduleData.MAIL_CHECKBOX == '0' || parseScheduleData.MAIL_CHECKBOX == undefined || parseScheduleData.MAIL_CHECKBOX == false) {
            mailCheckBox = null;
        }
        else {
            mailCheckBox = parseScheduleData.MAIL_CHECKBOX.toString();
        }


        let data_obj = [
            { SCHEDULAR_NAME: [/^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,50}$/, 1, ""] },
            { REPOID: [/[0-9]*/, 1, 1] },
            { REPO_FORMAT: [/[a-zA-Z]*/, 1, ""] },
            { SCHEDULE_TIME: [/[0-9]*/, 1, ""] },
            { P_SCHEDULE_TIME1: [/^[a-zA-Z0-9](\s?[a-zA-Z0-9]){0,50}$/, 0, ""] },
            { SENDER_EMAIL: [/^[a-zA-Z]+[a-zA-Z0-9._-]+@(echelonedge.com)+([,]+[a-zA-Z]+[a-zA-Z0-9._-]+@(echelonedge.com))*$/, emailValidationFlag, ""] }

        ]
        parseScheduleData.SENDER_EMAIL = emialString;
        const repoFormat = parseScheduleData.REPO_FORMAT.toLowerCase(); // it is used for validate report format it should be only "pdf", "csv", "xlsx"
        const validCombinations = [["pdf"], ["csv"], ["xlsx"], ["pdf", "csv"], ["pdf", "xlsx"], ["csv", "xlsx"], ["pdf", "csv", "xlsx"]];
        let isValidCombination = false;
        for (const validCombination of validCombinations) {
            if (validateBothArrays(validCombination, repoFormat.split(','))) {
                isValidCombination = true;
                break;
            }
        }


        if (!isValidCombination) {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "Invalid REPO_FORMAT. Allowed only pdf, csv, xlsx." }));
        }
        //in this function we match both arrays validCombinations and repoFormatArray
        function validateBothArrays(validCombinationsArray, repoFormatArray) {
            return validCombinationsArray.length === repoFormatArray.length && validCombinationsArray.every(value => repoFormatArray.includes(value));
        }


        if (parseScheduleData.SCHEDULED_TIME1?.trim() == null || parseScheduleData.SCHEDULED_TIME1?.trim() == "") {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "Schedule time should not be null." }));
        }
        if (!parseScheduleData.SCHEDULAR_ID && module[0].CREATE_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You do not have permission." }]));
        } else if (parseScheduleData.SCHEDULAR_ID && module[0].EDIT_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You do not have permission." }]));
        }
        // else if (parseScheduleData.SCHEDULAR_ID != null && compareData == true) {
        //     res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you can not update without any change." }]));
        // }
        // else if (((parseScheduleData.MAIL_CHECKBOX == true || parseScheduleData.MAIL_CHECKBOX == "true") && emialString.length == 0) || ((parseScheduleData.MAIL_CHECKBOX == false || parseScheduleData.MAIL_CHECKBOX == "") && emialString.length != 0)) {
        else if ((parseScheduleData.MAIL_CHECKBOX == true && emialString.length == 0) || (parseScheduleData.MAIL_CHECKBOX == false && emialString.length != 0)) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Please enter valid data." }]));
        }

        else {
            let validation = operationCtrl.customValidations_EncryptSchedule(parseScheduleData, res, data_obj);
            let email = parseScheduleData.user_email?.toLowerCase();

            if (validation == 0) {
                const result = await dbCon.execute(
                    `BEGIN ADD_UPDATE_REPORT_SCHEDULE(:P_SCHEDULE_ID, :P_SCHEDULE_NAME, :P_REPORT_ID, :P_SCH_REPO_FORMAT, :P_SCHEDULE_TIME, :P_EMAILS, :P_SCHEDULE_TIME1, :P_MAIL_CHECKBOX, :P_CREATED_BY, :CUR_DATA); END;`,
                    {
                        P_SCHEDULE_ID: { dir: oracledb.BIND_IN, val: parseScheduleData.SCHEDULAR_ID },
                        P_SCHEDULE_NAME: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseScheduleData.SCHEDULAR_NAME },
                        P_REPORT_ID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseScheduleData.REPOID.toString() },
                        P_SCH_REPO_FORMAT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseScheduleData.REPO_FORMAT },
                        P_SCHEDULE_TIME: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseScheduleData.SCHEDULE_TIME },
                        P_EMAILS: { dir: oracledb.BIND_IN, val: emialString },
                        P_SCHEDULE_TIME1: { dir: oracledb.BIND_IN, val: parseScheduleData.SCHEDULED_TIME1 },
                        P_MAIL_CHECKBOX: { dir: oracledb.BIND_IN, val: mailCheckBox },
                        P_CREATED_BY: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    },
                    {}
                );
                const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
                if (finalData[0].ERR == 'X') {
                    res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
                } else {
                    res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    chroneJob.chronjobModule.stopCronJob('stop', parseScheduleData.REPOID, req.payload.USER_ID, flag = 1);
                    ScedulerDataRecords(parseScheduleData.REPOID, 'Process');
                    // executeBillingQuery(finalData[0].REPO_QUERY.toString().replace(';', '').trim(), parseScheduleData.SCHEDULE_TIME, finalData[0].REPORT_NAME, req.body.REPO_FORMAT, req.body.REPOID);
                }
            } else {
                res.end(commonFunction.getErrorResponse(validation));
            }
        }


    } catch (error) {
        // console.log(error, 'err')
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}

//  this function is used for scheduled reports 
let list_of_schedule;
let sechudlerArr = [];

function ScedulerDataRecords(Rptid, cur_status) {
    setTimeout(async () => {
        try {
            const result = await dbCon.execute(

                `BEGIN GET_SCHEDULED_REPORTS_LIST(:rpt_id,:CUR_DATA);END;`,
                {
                    rpt_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: Rptid.toString() },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            list_of_schedule = JSON.parse(commonFunction.getSuccessResponse(finalData, '', finalData[0]?.MSG)).result;
            if (list_of_schedule) {
                executeScheduling();
            }
        } catch (error) {

        }

    }, 1000);



}

ScedulerDataRecords('', '');

// this function is used for execute scheduling
function executeScheduling() {
    for (let i = 0; i < list_of_schedule.length; i++) {
        if (list_of_schedule[i].CURRENT_STATUS != 'stop') {
            sechudlerArr.push(executeBillingQuery(list_of_schedule[i]?.QUERY.toString().replace(';', '').trim(), list_of_schedule[i]?.SCHEDULE_TIME, list_of_schedule[i]?.REPO_NAME, list_of_schedule[i]?.SCH_REPO_FORMAT, list_of_schedule[i]?.REPORT_ID, list_of_schedule[i]?.CURRENT_STATUS, list_of_schedule[i]?.USER_EMAILS, list_of_schedule[i].PROCESS_TYPE, list_of_schedule[i]?.REPO_HEADER, list_of_schedule[i]?.LATEST_STATUS, list_of_schedule[i]?.REPORT_PATH, list_of_schedule[i]?.EMAIL_CONFIG));
        }
    }
    if (sechudlerArr.length !== 0) {
        Promise.all(sechudlerArr).then((results) => {
            sechudlerArr = [];
            list_of_schedule = [];
        }).catch((error) => {
            console.error("error.message", error.message);
        });
    } else {

    }
}


// for execute schedule for report
function executeBillingQuery(repo_query, SCHEDULE_TIME, REPORT_NAME, REPORT_FORMAT, REPO_ID, CURRENT_STATUS, USER_EMAILS, PROCESS_TYPE, REPO_HEADER, LATEST_STATUS, REPORT_PATH, EMAIL_CONFIG) {
    // concate emails and email config 
    //let emailConfig = EMAIL_CONFIG;
    //let userEmail;
    let userEmail = (EMAIL_CONFIG ? EMAIL_CONFIG + ',' : '') + USER_EMAILS;
    // Remove duplicates by splitting, creating a Set, and joining the array back
    let uniqueEmails = [...new Set(userEmail.split(','))].join(',');

    // if (emailConfig === null) {
    //     // Handle the case where emailConfig is null
    //     userEmail = USER_EMAILS;
    // } else {
    //     // If emailConfig is not null, concatenate the strings
    //     userEmail = emailConfig.concat(',', USER_EMAILS);
    // }

    const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
    const fileName = `${REPORT_NAME}_${currentDateTime}`;
    return new Promise(async (resolve, reject) => {
        try {
            const result = await dbCon.execute(
                `BEGIN get_billing_reports(:report_query,:p_type,:my_cursor);END;`,
                {
                    report_query: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repo_query },
                    p_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: PROCESS_TYPE },
                    my_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                { outFormat: oracledb.OUT_FORMAT_OBJECT });
            const finalData = await commonFunction.getResultSetManually(result.outBinds.my_cursor);
            // if (finalData[0]?.ERR) {

            //     addReportStatus('Error', REPO_ID, -1, fileName, finalData[0].ERR, REPORT_FORMAT);
            // } else {

            chroneJob.chronjobModule.jobExecute(repo_query, CURRENT_STATUS, finalData, SCHEDULE_TIME, REPORT_NAME, REPORT_FORMAT, REPO_ID, uniqueEmails, '', REPO_HEADER, PROCESS_TYPE, repo_query, LATEST_STATUS, REPORT_PATH);
            // }
            resolve(true);
            // res.end(commonFunction.getSuccessResponse(finalData));

        } catch (error) {
            console.log(error, 'err');
            reject(true)
            // res.end(commonFunction.getErrorResponse(error, error));
        }
    })


}

async function executeSchduleManually(repo_query, SCHEDULE_TIME, REPORT_NAME, REPORT_FORMAT, REPO_ID, CURRENT_STATUS, USER_EMAILS, PROCESS_TYPE, USER_ID, REPO_HEADER, REPORT_PATH, EMAIL_CONFIG) {

    // let emailConfig = EMAIL_CONFIG;
    // let userEmail;
    // if (emailConfig === null) {
    //     userEmail = USER_EMAILS;
    // } else {
    //     userEmail = emailConfig.concat(',', USER_EMAILS);
    // }

    let userEmail = (EMAIL_CONFIG ? EMAIL_CONFIG + ',' : '') + USER_EMAILS;
    // Remove duplicates by splitting, creating a Set, and joining the array back
    let uniqueEmails = [...new Set(userEmail.split(','))].join(',');


    const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
    const fileName = `${REPORT_NAME}_${currentDateTime}`;
    try {
        const result = await dbCon.execute(
            `BEGIN get_billing_reports(:report_query,:p_type,:my_cursor);END;`,
            {
                report_query: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repo_query.toString().replace(';', '').trim() },
                p_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: PROCESS_TYPE },
                my_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            { outFormat: oracledb.OUT_FORMAT_OBJECT });

        const finalData = await commonFunction.getResultSetManually(result.outBinds.my_cursor);

        if (finalData[0].ERR) {
            addReportStatus('ReExeError', REPO_ID, USER_ID, fileName, finalData[0].ERR, REPORT_FORMAT, 0);
        } else {
            chroneJob.chronjobModule.executeJobManually(repo_query, CURRENT_STATUS, finalData, '', REPORT_NAME, REPORT_FORMAT, REPO_ID, uniqueEmails, PROCESS_TYPE, USER_ID, REPO_HEADER, REPORT_PATH);
        }
        ;


    } catch (error) {
        console.log(error, 'err');

        // res.end(commonFunction.getErrorResponse(error, error));
    }



}

// used for update status  of report in db
async function addReportStatus(reportStatus, repoId, user_id, fileName, catchError, reportFormats, executionStatus) {
    try {
        const result = await dbCon.execute(
            `BEGIN ADD_REPORT_STATUS(:REPORT_STATUS,:REPORT_ID,:USER_ID,:REPORT_NAME,:ERROR_MSG,:REPORT_FORMAT,:EXECUTION_STATUS,:CUR_DATA);END;`,
            {
                REPORT_ID: { dir: oracledb.BIND_IN, val: repoId },
                REPORT_STATUS: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reportStatus },
                USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: user_id },
                REPORT_NAME: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: fileName },
                ERROR_MSG: { dir: oracledb.BIND_IN, val: JSON.stringify(catchError) },
                REPORT_FORMAT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reportFormats },
                EXECUTION_STATUS: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: executionStatus },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);


    } catch (error) {
        console.log(error, 'err')

    }
}

// for delete scheduler
operationCtrl.deleteSchdeuler = async (req, res) => {
    try {
        let data_obj = [
            { report_id: [/^.{1,100}$/, 1, ""] },
            { SCHEDULER_ID: [/^.{1,100}$/, 1, 1] },
            { action: [/^.{1,100}$/, 1, ""] }
        ]
        let validation = operationCtrl.customValidations(req, res, data_obj);
        if (validation == 0) {
            let action_by = req.payload.USER_ID;
            let CURRENT_STATUS = req.body.action === '0' ? 'Ready' : 'stop';
            chroneJob.chronjobModule.stopCronJob(CURRENT_STATUS, req.body.report_id, action_by);
            const result = await dbCon.execute(
                `BEGIN DELETE_SCHEDULER(:param_report_id,:SCHEDULAR_ID,:action,:action_by,:current_status,:PARAM_SD_LOG_DEL_REASON,:CUR_DATA);END;`,
                {
                    param_report_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.report_id },
                    SCHEDULAR_ID: { dir: oracledb.BIND_IN, val: req.body.SCHEDULER_ID },
                    action: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action },
                    action_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: action_by },
                    current_status: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: CURRENT_STATUS },
                    PARAM_SD_LOG_DEL_REASON: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.delete_reason },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (finalData[0].ERR == 'X') {
                res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                // executeBillingQuery(finalData[0].REPO_QUERY.toString().replace(';', '').trim(), req.body.SCHEDULE_TIME, finalData[0].REPORT_NAME, req.body.REPO_FORMAT);
            }
        } else {
            res.end(commonFunction.getErrorResponse(validation));
        }

    } catch (error) {
        console.log(error, 'err')
        // res.end(commonFunction.getErrorResponse(error));
    }
}



// to Active Scheduler api
operationCtrl.activeScheduler = async (req, res) => {
    try {
        let data_obj = [
            { report_id: [/^.{1,100}$/, 1, ""] },
            { SCHEDULER_ID: [/^.{1,100}$/, 1, 1] },
            { action_type: [/^.{1,100}$/, 1, ""] },
            { action: [/^.{1,100}$/, 1, ""] }
        ]
        let validation = operationCtrl.customValidations(req, res, data_obj);
        if (validation == 0) {
            let CURRENT_STATUS = req.body.action === '0' ? 'Ready' : 'stop';
            let action_by = req.payload.USER_ID;
            const result = await dbCon.execute(
                `BEGIN ACTIVE_DELETE_SCHEDULE (:param_report_id,:param_schedularId,:action_type,:action,:action_by,:delete_reason,:current_status,:CUR_DATA); END; `,
                {
                    param_report_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.report_id },
                    param_schedularId: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.body.SCHEDULER_ID },
                    action_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action_type },
                    action: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action },
                    action_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: action_by },
                    delete_reason: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.delete_reason },
                    current_status: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: CURRENT_STATUS },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }

                },

                {});

            const activeDeleteResult = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (activeDeleteResult[0].ERR == 'X') {
                res.end(commonFunction.getErrorResponse(activeDeleteResult));
            } else {
                if (CURRENT_STATUS == 'stop') {
                    chroneJob.chronjobModule.stopCronJob(CURRENT_STATUS, req.body.report_id, action_by);
                } else {
                    ScedulerDataRecords(req.body.report_id, CURRENT_STATUS);
                }
                res.end(commonFunction.getSuccessResponse(activeDeleteResult, '', activeDeleteResult[0].MSG));

            }
        } else {
            res.end(commonFunction.getErrorResponse(validation));
        }
    }
    catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }

}
// method used for Schedule listing
operationCtrl.getScheduleListing = async (req, res) => {
    try {
        const data = req.query;
        let userId = parseInt(data.userId);
        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        if (!data.page) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "page is required filed" }]));
        } else if (!data.size) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "size is required filed" }]));
        }
        else if (!userId) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "user id is required filed" }]));
        }
        else {
            const result = await dbCon.execute(
                `BEGIN GET_SCHEDULE_LISTING(:p_user_id,:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:P_CURSOR,:Q_CURSOR);END;`,
                {
                    p_user_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                    param_page: { dir: oracledb.BIND_IN, val: data.page },
                    param_size: { dir: oracledb.BIND_IN, val: data.size },
                    param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                    param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                    param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                    P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

            const finalDatacount = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);

            if (finalData) {

                res.end(commonFunction.getSuccessResponse([finalData, finalDatacount], '', ''));
            } else {
                res.end(commonFunction.getErrorResponse(finalData.err));
            }
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }

}





// SCHEDULE EMAIL CONFIGURATION
operationCtrl.getScheduledReportList = async (req, res) => {

    try {
        const result = await dbCon.execute(
            `BEGIN GET_EMAIL_CONFIG_REPORT_LIST(:userId,:repoId,:CUR_DATA);END;`,
            {
                userId: {
                    dir: oracledb.BIND_IN,
                    //type: oracledb.NUMBER,
                    val: req.payload.USER_ID,
                },

                repoId: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.query.reportId,
                },


                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );



        let responseData;
        responseData = await buildTree(finalData, null);

        res.end(
            await commonFunction.getSuccessResponse(
                responseData,
                "",
                "Report List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}


/**this function used for making parent children structure in add edit view */
function buildTree(data, parentId = null) {
    const tree = [];
    let isCheckedVar = false;
    for (const row of data) {
        if (row.PARENT_ID === parentId) {
            const node = {
                display: row.TYPE_NAME,
                value: row.TYPE,
                parent_Id: row.PARENT_ID,
                report_Id: row.TYPE_ID,
                isSelected: isCheckedVar,
                children: buildTree(data, row.TYPE_ID),
            };
            tree.push(node);
        }
    }
    return tree;
}




// used for add update email config 
operationCtrl.addUpdateEmailConfig = async (req, res) => {
    try {
        let emailConfigData = CryptoJS.AES.decrypt(req.body.obj, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let parseEmailConfigData = JSON.parse(emailConfigData);

        // use for get user id from user  headers.authorization
        let userAuthorization = parseJwt(req.headers.authorization);
        let userId = userAuthorization.USER_ID;

        let reportId = parseEmailConfigData.reportId.sort();
        let emailId = parseEmailConfigData.emailId;


        // Validate email domain (should be @echelonedge.com)
        let validateEmailDomain = emailId.every(email => emailRegex.test(email));
        // it is used to check email length it should be less than 50 
        let validateEmailLength = emailId.every(email => email.length < 50);
        if (!validateEmailDomain) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Invalid email domain. Only @echelonedge.com is allowed." }]));
        }
        else if (!validateEmailLength) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Email length should be less than 50." }]))
        }

        let allEmailReportId = reportId.map((value) => {
            concatinateEmails = emailId.join(',');
            return `${value}*${concatinateEmails}`;
        }).join('#').toString();




        if (reportId.length === 0 || emailId.length === 0) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Invalid!" }]));
        } else if (emailId.length > 15) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Email should be less than 15." }]));
        }
        const result = await dbCon.execute(
            `BEGIN ADD_UPDATE_EMAIL_CONFIG(:P_USER_ID,:P_VALUE,:GROUP_NAME,:CUR_DATA);END;`,
            {
                P_USER_ID: { dir: oracledb.BIND_IN, val: userId },
                P_VALUE: { dir: oracledb.BIND_IN, val: allEmailReportId },
                GROUP_NAME: { dir: oracledb.BIND_IN, val: parseEmailConfigData.groupName },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
        } else {
            // use to add update report email data when scheduler is running.
            reportId.forEach(item => {
                chroneJob.chronjobModule.stopCronJob('stop', item, userId, flag = 1);
                ScedulerDataRecords(item, '');

            });
            res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));

        }

    } catch (error) {
        //console.log(error)
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}



// used for add update email config 
operationCtrl.deleteEmailConfig = async (req, res) => {
    try {
        // use to store report id's to delete email config 
        let reportIds = req.body.reportIds;
        const result = await dbCon.execute(
            `BEGIN DELETE_EMAIL_CONFIG(:P_USER_ID,:P_GROUP_NAME,:PARAM_DELETE_REASON,:CUR_DATA);END;`,
            {
                P_USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                P_GROUP_NAME: { dir: oracledb.BIND_IN, val: req.body.groupId },
                PARAM_DELETE_REASON: { dir: oracledb.BIND_IN, val: req.body.delete_reason },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        //ScedulerDataRecords(Rptid, '')
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
        } else {
            // chroneJob.chronjobModule.stopCronJob('stop', req.body.REPOID, req.payload.USER_ID, flag = 1);
            reportIds.forEach(item => {
                chroneJob.chronjobModule.stopCronJob('stop', item, req.payload.USER_ID, flag = 1);
                ScedulerDataRecords(item, '');
            });
            res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
        }

    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}


// method used for Email config Schedule listing
operationCtrl.getEmailConfigListDetails = async (req, res) => {
    try {

        // use for get user id from user  headers.authorization
        let userAuthorization = parseJwt(req.headers.authorization);
        let userId = userAuthorization.USER_ID;
        const data = req.query;
        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        if (!data.page) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "page is required filed" }]));
        } else if (!data.size) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "size is required filed" }]));
        }
        else {
            const result = await dbCon.execute(
                `BEGIN GET_EMAIL_CONFIG_LISTING(:p_user_id,:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:P_CURSOR,:Q_CURSOR);END;`,
                {
                    p_user_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                    param_page: { dir: oracledb.BIND_IN, val: data.page },
                    param_size: { dir: oracledb.BIND_IN, val: data.size },
                    param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                    param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                    param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                    P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);
            const finalDatacount = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);

            if (finalData) {

                res.end(commonFunction.getSuccessResponse([finalData, finalDatacount], '', ''));
            } else {
                res.end(commonFunction.getErrorResponse(finalData.err));
            }
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error.toString()));
    }

}


operationCtrl.getAllUserEmailList = async (req, res) => {
    try {
        const data = req.query.emailData;
        const result = await dbCon.execute(
            `BEGIN GET_EMAILS_LIST_FOR_CONFIG(:P_SEARCH_BY,:P_CURSOR);END;`,
            {
                P_SEARCH_BY: { dir: oracledb.BIND_IN, val: data },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }



    } catch (error) {

    }
}


// use for get user id from header.
function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

module.exports = operationCtrl;