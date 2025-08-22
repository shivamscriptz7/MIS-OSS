/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 02/05/2024
 * Author:Shivam Shakya
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */


const connection = require('../CommonFiles/connection').dbConnection;
const path = require("path");
const fs = require('fs').promises;;
const monitoringCtrl = {};
const oracledb = require('oracledb');
const commonFunction = require('../CommonFiles/commonFunction');
const { catchError } = require('rxjs');
const { execute } = require('@angular-devkit/build-angular/src/builders/extract-i18n');
var dbCon;
const CryptoJS = require('crypto-js');
const socketService = require('../CommonFiles/socket_server')
const sceretEncrypt_Decryptkey = require('../../../config.json');
const { log } = require('console');
// var myCon = connection.then((connection) => {
//     dbCon = connection;
// });

const Hostname = require('../../../remote-server.json');
const sftpClient = require('ssh2-sftp-client');
// const sftp = new sftpClient();


const exec = require("child_process").exec;
const { Client } = require('ssh2');

monitoringCtrl.getLogDetails = async (req, res) => {
    try {
        const data = req.query;
        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        oracledb.fetchAsString = [oracledb.CLOB];
        const result = await dbCon.execute(
            `BEGIN GET_LOG_DETAILS(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:PARAM_MODULE_ID,:P_CURSOR,:Q_CURSOR); END;`,
            {
                param_page: { dir: oracledb.BIND_IN, val: data.page },
                param_size: { dir: oracledb.BIND_IN, val: data.size },
                param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                PARAM_MODULE_ID: { dir: oracledb.BIND_IN, val: data.moduleId },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

        const finalDataDynamicModules = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, finalDataDynamicModules, '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}






monitoringCtrl.getLogModuleList = async (req, res) => {
    try {
        oracledb.fetchAsString = [oracledb.CLOB];
        const result = await dbCon.execute(
            `BEGIN GET_LOG_MODULE_DETAILS(:P_CURSOR); END;`,
            {
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}




monitoringCtrl.getLogsFilteredData = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data)
        const result = await dbCon.execute(
            `BEGIN GET_LOG_MODULE_DETAILS(:P_CURSOR); END;`,
            {
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}


monitoringCtrl.getUserLogList = async (req, res) => {
    try {
        //let data = JSON.parse(req.query.data)
        const result = await dbCon.execute(
            `BEGIN GET_LOGS_USERDATA(:P_CURSOR); END;`,
            {
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {

        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}


monitoringCtrl.getScheduleLogDetails = async (req, res) => {

    try {
        const data = req.query;

        data.fromDate == '' ? null : data.fromDate;
        data.toDate == '' ? null : data.toDate;
        data.logAction == '' ? null : data.logAction;
        data.userId == '' ? null : data.userId
        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        oracledb.fetchAsString = [oracledb.CLOB];
        const result = await dbCon.execute(
            `BEGIN GET_SCHEDULE_LOG_DETAILS(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:PARAM_MODULE_ID,:PARAM_FROM_DATE,:PARAM_TO_DATE,:PARAM_LOG_ACTION,:PARAM_LOG_USERID,:P_CURSOR,:Q_CURSOR); END;`,
            {
                param_page: { dir: oracledb.BIND_IN, val: data.page },
                param_size: { dir: oracledb.BIND_IN, val: data.size },
                param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                PARAM_MODULE_ID: { dir: oracledb.BIND_IN, val: data.moduleId },
                PARAM_FROM_DATE: { dir: oracledb.BIND_IN, val: data.fromDate },
                PARAM_TO_DATE: { dir: oracledb.BIND_IN, val: data.toDate },
                PARAM_LOG_ACTION: { dir: oracledb.BIND_IN, val: data.logAction },
                PARAM_LOG_USERID: { dir: oracledb.BIND_IN, val: data.userId },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

        const finalDataDynamicModules = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, finalDataDynamicModules, '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}




monitoringCtrl.getLogFilterDetails = async (req, res) => {

    try {
        const data = req.query;
        data.fromDate == '' || data.fromDate == undefined ? null : data.fromDate;
        data.toDate == '' || data.toDate == undefined ? null : data.toDate;
        data.logAction == '' || data.logAction == undefined ? null : data.logAction;
        data.userId == '' || data.userId == undefined ? null : data.userId;
        data.type == '' || data.type == undefined ? null : data.type;

        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        oracledb.fetchAsString = [oracledb.CLOB];
        const result = await dbCon.execute(
            `BEGIN GET_LOG_DETAILS_DUMMY(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:PARAM_MODULE_ID,:PARAM_FROM_DATE,:PARAM_TO_DATE,:PARAM_LOG_ACTION,:PARAM_LOG_USERID,:PARAM_LOG_TYPE,:P_CURSOR,:Q_CURSOR); END;`,
            {
                param_page: { dir: oracledb.BIND_IN, val: data.page },
                param_size: { dir: oracledb.BIND_IN, val: data.size },
                param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                PARAM_MODULE_ID: { dir: oracledb.BIND_IN, val: data.moduleId },
                PARAM_FROM_DATE: { dir: oracledb.BIND_IN, val: data.fromDate },
                PARAM_TO_DATE: { dir: oracledb.BIND_IN, val: data.toDate },
                PARAM_LOG_ACTION: { dir: oracledb.BIND_IN, val: data.logAction },
                PARAM_LOG_USERID: { dir: oracledb.BIND_IN, val: data.userId },
                PARAM_LOG_TYPE: { dir: oracledb.BIND_IN, val: data.type },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

        const finalDataDynamicModules = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, finalDataDynamicModules, '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}



monitoringCtrl.getLogFilterTypeDetails = async (req, res) => {

    try {
        const data = req.query;
        data.fromDate == '' || data.fromDate == undefined ? null : data.fromDate;
        data.toDate == '' || data.toDate == undefined ? null : data.toDate;
        data.logAction == '' || data.logAction == undefined ? null : data.logAction;
        data.userId == '' || data.userId == undefined ? null : data.userId;;
        data.type == '' || data.type == undefined ? null : data.type;

        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        oracledb.fetchAsString = [oracledb.CLOB];
        const result = await dbCon.execute(
            `BEGIN GET_LOG_DETAILS_DUMMY(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:PARAM_MODULE_ID,:PARAM_FROM_DATE,:PARAM_TO_DATE,:PARAM_LOG_ACTION,:PARAM_LOG_USERID,:PARAM_LOG_TYPE,:P_CURSOR,:Q_CURSOR); END;`,
            {
                param_page: { dir: oracledb.BIND_IN, val: data.page },
                param_size: { dir: oracledb.BIND_IN, val: data.size },
                param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                PARAM_MODULE_ID: { dir: oracledb.BIND_IN, val: data.moduleId },
                PARAM_FROM_DATE: { dir: oracledb.BIND_IN, val: data.fromDate },
                PARAM_TO_DATE: { dir: oracledb.BIND_IN, val: data.toDate },
                PARAM_LOG_ACTION: { dir: oracledb.BIND_IN, val: data.logAction },
                PARAM_LOG_USERID: { dir: oracledb.BIND_IN, val: data.userId },
                PARAM_LOG_TYPE: { dir: oracledb.BIND_IN, val: data.type },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);
        const finalDataDynamicModules = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, finalDataDynamicModules, '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }


    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(finalData.err));

    }

}



/**this method used for types Data which assigned to user */
monitoringCtrl.getTypePermissionDataLog = async (req, res) => {
    try {

        let userId = req.query.userId;
        const result = await dbCon.execute(
            `BEGIN GET_TYPE_PERMISSION_LOG_DATA(:userId,:CUR_DATA);END;`,
            {
                userId: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: userId,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );



        res.end(
            commonFunction.getSuccessResponse(
                finalData,
                "",
                "Report List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};


/**this function used for making parent childrens sturcture in view listing */
function viewbuildTreeLog(data, parentId = null, editPermissionData) {
    const tree = [];
    let isCheckedVar = false;
    for (const row of data) {
        if (row.PARENT_ID === parentId) {
            if (editPermissionData.some((el) => el.REPORT_ID === row.TYPE_ID)) {
                isCheckedVar = true;
            } else {
                isCheckedVar = false;
            }
            /**end */
            const node = {
                display: row.TYPE_NAME,
                value: row.TYPE_NAME,
                parent_Id: row.PARENT_ID,
                report_Id: row.TYPE_ID,
                isSelected: isCheckedVar,
                children: viewbuildTreeLog(data, row.TYPE_ID, editPermissionData),
            };

            /** this condition used for listing view */
            if (node.children.length == 0 && node.isSelected == true) {
                tree.push(node);
            }
            if (node.children.length > 0) {
                if (!tree.includes(node)) {
                    tree.push(node);
                }
            }
            /** End */
        }
    }
    return tree;
}


/**this function used for making parent children structure in add edit view */
function buildTreeLog(data, parentId = null, editPermissionData) {
    const tree = [];
    let isCheckedVar = false;
    for (const row of data) {
        if (row.PARENT_ID === parentId) {
            if (editPermissionData.some((el) => el.REPORT_ID === row.TYPE_ID)) {
                isCheckedVar = true;
            } else {
                isCheckedVar = false;
            }
            const node = {
                display: row.TYPE_NAME,
                value: row.TYPE_NAME,
                parent_Id: row.PARENT_ID,
                report_Id: row.TYPE_ID,
                isSelected: isCheckedVar,
                children: buildTreeLog(data, row.TYPE_ID, editPermissionData),
            };

            tree.push(node);
        }
    }
    return tree;
}

monitoringCtrl.addUpdateMonitoring = async (req, res) => {
    try {
        let monitoringData = CryptoJS.AES.decrypt(req.body.obj, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let parseMonitoringData = JSON.parse(monitoringData);
        let formData = parseMonitoringData.stepArray;  // Assuming stepArray is an array of steps (dataArray)
        const fromDataArray = [];
        for (let i = 0; i < formData.length; i++) {
            fromDataArray.push({
                jobName: parseMonitoringData.jobName.trim(),
                jobScript: parseMonitoringData.jobScript,
                hostName: parseMonitoringData.hostName,
                stepName: formData[i].stepName.trim(),
                stepDescription: formData[i].stepDescription === '' ? null : formData[i].stepDescription,
                filePath: formData[i].filePath,
                shellScript: formData[i].shellScript.trim() === '' ? null : formData[i].shellScript.trim(),
                noOfProcess: formData[i].noOfProcess
            });
        }
        // this is used to make json data of changeable fields for validate in data base.
        const fromJsonData = JSON.stringify(fromDataArray);
        // Convert dataArray to JSON string
        const jsonData = JSON.stringify(formData);
        const userData = parseJwt(req.headers.authorization); // Parsing user data from JWT token
        const userId = userData.USER_ID;  // Extracting user ID from the JWT
        const result = await dbCon.execute(
            `BEGIN ADD_UPDATE_MONITORING(:P_JOB_NAME,:P_JOB_SCRIPT,:P_HOST_NAME,:P_JOB_ID,:P_JSON_DATA,:P_JSON_FORM_DATA,:P_CREATED_BY,:P_UPDATED_BY,:CUR_DATA); END;`,
            {
                P_JOB_NAME: { dir: oracledb.BIND_IN, val: parseMonitoringData.jobName },
                P_JOB_SCRIPT: { dir: oracledb.BIND_IN, val: parseMonitoringData.jobScript },
                P_HOST_NAME: { dir: oracledb.BIND_IN, val: parseMonitoringData.hostName },
                P_JOB_ID: { dir: oracledb.BIND_IN, val: parseMonitoringData.jobId },
                P_JSON_DATA: { dir: oracledb.BIND_IN, val: jsonData, type: oracledb.CLOB },  // Passing the JSON string as a CLOB
                P_JSON_FORM_DATA: { dir: oracledb.BIND_IN, val: fromJsonData },  // Passing the JSON string as a CLOB AND first 5 fields data
                P_CREATED_BY: { dir: oracledb.BIND_IN, val: userId },  // Created by user
                P_UPDATED_BY: { dir: oracledb.BIND_IN, val: userId },  // Updated by same user
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }  // Output cursor
            }, {}
        );

        // Process the result from the cursor
        const resultSet = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (resultSet && resultSet.length > 0) {
            res.end(commonFunction.getSuccessResponse(resultSet, 'Monitoring data inserted successfully.'));
        } else {
            res.end(commonFunction.getErrorResponse('No results were processed.'));
        }

    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};




/**use for get Monitoring Listing  */
monitoringCtrl.getMonitoringListing = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_MONITORING_LIST(:param_jobId,:CUR_DATA);END;`,
            {
                param_jobId: { dir: oracledb.BIND_IN, val: req.query.jobId },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, ''));
            socketService.viewStepsMonitoring(finalData);

        } else {

            res.end(commonFunction.getErrorResponse(finalData.err));
        }
    } catch (error) {

        res.end(commonFunction.getErrorResponse(error));
    }
};


monitoringCtrl.getFilePathOfMonitoring = async (req, res) => {
    const filename = req.query.filePath;
    const hostName = req.query.hostName;
    let fileData = null;

    try {
        if (!filename) {
            return res.status(400).json({ error: "File path must be specified in the query parameter." });
        }

        // Check if the IP address exists in the hostname data
        if (Hostname[hostName]) {
            const sftp = new sftpClient();
            const { username, password } = Hostname[hostName]; // Note: Case sensitivity in 'Hostname'
            try {

                await sftp.connect({
                    host: hostName,
                    username,
                    password,
                });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const fileContent = await sftp.get(`${filename}`);

                fileData = fileContent.toString();

            } catch (err) {
                // console.log(err.message, "errorrrr")
                fileData = `Error fetching file: ${err.message}`;
            } finally {
                await sftp.end();
            }
        } else {
            fileData = `IP address ${hostName} not found.`;
        }


        // Return the file content in the response
        return res.json({ content: fileData });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};



// used for role list
monitoringCtrl.getJobList = async (req, res) => {
    try {
        const data = req.query;
        const sortType = data.ordering ? data.ordering.replace('-', '') : '';
        const searchBy = data.search ? data.search.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\%/g, '\\%') : '';
        const sortBy = data.ordering && data.ordering.indexOf('-') == 0 ? 'DESC' : 'ASC';
        if (!data.page) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "page is required filed" }]));
        } else if (!data.size) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "size is required filed" }]));
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_JOB_MONITORING_LISTING(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:P_CURSOR,:Q_CURSOR);END;`,
                {
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
                // fetchServerData();
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

// for delete Monitoring
monitoringCtrl.deleteMonitoring = async (req, res) => {
    try {
        const userData = parseJwt(req.headers.authorization); // Parsing user data from JWT token
        const userId = userData.USER_ID;  // Extracting user ID from the JWT
        const result = await dbCon.execute(
            `BEGIN DELETE_MONITORING(:P_JOB_ID,:P_USER_ID,:P_DEL_REASON,:CUR_DATA);END;`,
            {
                P_JOB_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.body.JOB_ID },
                P_USER_ID: { dir: oracledb.BIND_IN, val: userId },
                P_DEL_REASON: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.deleteReason },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);

        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
        } else {
            res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
        }
    } catch (error) {
        console.log(error, 'err')
    }
}



function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}




monitoringCtrl.singleExecute = async (req, res) => {
    const conn = new Client(); // Create a new SSH client instance
    let responseSent = false; // Flag to ensure a single response

    try {
        const host = req.body.formData.hostName;
        const port = 22; // Default SSH port
        const username = req.body.formData.userName;
        const password = req.body.formData.userPassword.trim();
        const scriptPath = req.body.script;
        //const command = 'sh ' + `${scriptPath}`; // Replace with the desired command
        const command = 'nohup sh ' + `${scriptPath}` + '> /dev/null 2>&1 &';

        // Set up event listeners
        conn.on('ready', () => {
            conn.exec(command, (err, stream) => {
                if (err) {
                    console.error(`Error executing command: ${err.message}`);
                    if (!responseSent) {
                        responseSent = true;
                        res.status(500).json({
                            success: false,
                            message: `Command execution error: ${err.message}`,
                        });
                        conn.end(); // Close the connection
                    }
                    return;
                }

                let stdoutData = '';
                let stderrData = '';
                // Capture STDOUT
                stream.on('data', (data) => {
                    stdoutData += data;
                });

                // Capture STDERR
                stream.stderr.on('data', (data) => {
                    stderrData += data;
                });

                // Handle stream close
                stream.on('close', (code) => {
                    if (!responseSent) {
                        responseSent = true;
                        if (code === 0) {
                            res.status(200).json({
                                success: true,
                                message: 'Command executed successfully.',
                                stdout: stdoutData.trim(),
                                //stderr: stderrData.trim(),
                            });
                        } else {
                            res.status(200).json({
                                success: false,
                                message: 'Command executed with errors.',
                                //stdout: stdoutData.trim(),
                                stderr: stderrData.trim(),
                                exitCode: code,
                            });
                        }
                    }

                    conn.end(); // Close the connection
                });
            });
        });

        // Handle connection errors
        conn.on('error', (err) => {
            console.error(`Connection error: ${err.message}`);
            if (!responseSent) {
                responseSent = true;
                res.status(200).json({
                    success: false,
                    stderr: `Connection error: ${err.message}`,
                    message: `Connection error: ${err.message}`,
                });
            }
        });

        // Handle connection close
        conn.on('close', () => {
            // console.log('Connection closed');
        });

        // Connect to the remote server
        conn.connect({
            host,
            port,
            username,
            password,
        });
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        if (!responseSent) {
            responseSent = true;
            res.status(200).json({
                success: false,
                message: `Unexpected error: ${error.message}`,
            });
        }
    }
};


module.exports = monitoringCtrl;