/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 24/08/2023
 * Author:Shivam Shakya
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */


const connection = require('../CommonFiles/connection').dbConnection;
const dashboardCtrl = {};
const oracledb = require('oracledb');
const commonFunction = require('../CommonFiles/commonFunction');
var dbCon;
var myCon = connection.then((connection) => {
    dbCon = connection;
});

// we get chart data from this api
dashboardCtrl.getDashboardChartData = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_DASHBOARD_DATA(:A_CURSOR,:B_CURSOR,:C_CURSOR,:D_CURSOR);END;`,
            {
                A_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                B_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                C_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                D_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }


            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.A_CURSOR);
        const finalData1 = await commonFunction.getResultSet(result.outBinds.B_CURSOR);
        const finalData2 = await commonFunction.getResultSet(result.outBinds.C_CURSOR);
        const finalData3 = await commonFunction.getResultSet(result.outBinds.D_CURSOR);
        if (finalData, finalData1, finalData2, finalData3) {
            res.end(commonFunction.getSuccessResponse([finalData, finalData1, finalData2, finalData3], '', '', '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err, finalData1.err, finalData2.err, finalData3.err));
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }

}


// total  circle,zone,user,report counts on dashboard
dashboardCtrl.getDashboardCount = async (req, res) => {

    try {
        if (!req.payload.USER_ID) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "user id is required" }]));
        }
        const result = await dbCon.execute(
            `BEGIN GET_DASHBOARD_COUNTS(:P_USERID,:A_CURSOR); END;`,
            {
                P_USERID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                A_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.A_CURSOR);
        //console.log(finalData, "finalData")
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData.err));
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}

module.exports = dashboardCtrl;