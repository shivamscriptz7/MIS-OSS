/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 24/08/2023
 * Author:Shivam Shakya
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */


const { dbConnection } = require("../CommonFiles/connection");
const dashboardCtrl = {};
const oracledb = require('oracledb');
const commonFunction = require('../CommonFiles/commonFunction');
var dbCon;
var myCon = dbConnection.then((client) => {
    dbCon = client;
   // console.log("PostgreSQL client assigned in usercontroller:", new Date());
}).catch((err) => {
    console.error("Error assigning PostgreSQL client in usercontroller:", err.message, new Date());
});

// we get chart data from this api
// dashboardCtrl.getDashboardChartData = async (req, res) => {
//     try {
//         const result = await dbCon.execute(
//             `BEGIN GET_DASHBOARD_DATA(:A_CURSOR,:B_CURSOR,:C_CURSOR,:D_CURSOR);END;`,
//             {
//                 A_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//                 B_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//                 C_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//                 D_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }


//             },
//             {});
//         const finalData = await commonFunction.getResultSet(result.outBinds.A_CURSOR);
//         const finalData1 = await commonFunction.getResultSet(result.outBinds.B_CURSOR);
//         const finalData2 = await commonFunction.getResultSet(result.outBinds.C_CURSOR);
//         const finalData3 = await commonFunction.getResultSet(result.outBinds.D_CURSOR);
//         if (finalData, finalData1, finalData2, finalData3) {
//             res.end(commonFunction.getSuccessResponse([finalData, finalData1, finalData2, finalData3], '', '', '', ''));
//         } else {
//             res.end(commonFunction.getErrorResponse(finalData.err, finalData1.err, finalData2.err, finalData3.err));
//         }
//     } catch (error) {
//         console.log(error)
//         res.end(commonFunction.getErrorResponse(error));
//     }

// }

dashboardCtrl.getDashboardChartData = async (req, res) => {
    try {
        // Wait for dbCon to be assigned
        await myCon;

        if (!dbCon) {
            throw new Error("Database connection not established");
        }

        // Start transaction
        await dbCon.query('BEGIN');
        // Call the PostgreSQL stored procedure
        const queryText = 'CALL GET_DASHBOARD_DATA($1, $2, $3, $4)';
        const queryValues = ['a_cursor', 'b_cursor', 'c_cursor', 'd_cursor'];
        await dbCon.query(queryText, queryValues);

        // Fetch data from the cursors
        const aCursorResult = await dbCon.query('FETCH ALL IN a_cursor');
        const bCursorResult = await dbCon.query('FETCH ALL IN b_cursor');
        const cCursorResult = await dbCon.query('FETCH ALL IN c_cursor');
        const dCursorResult = await dbCon.query('FETCH ALL IN d_cursor');
        // Commit transaction
        await dbCon.query('COMMIT');

        // Process cursor results
        const finalData = await commonFunction.getResultSet(aCursorResult.rows);
        const finalData1 = await commonFunction.getResultSet(bCursorResult.rows);
        const finalData2 = await commonFunction.getResultSet(cCursorResult.rows);
        const finalData3 = await commonFunction.getResultSet(dCursorResult.rows);

        // Check if data is valid
        if (finalData && finalData1 && finalData2 && finalData3) {
            res.end(commonFunction.getSuccessResponse([finalData, finalData1, finalData2, finalData3], '', '', '', ''));
        } else {
            res.end(commonFunction.getErrorResponse(
                finalData?.err || 'No data',
                finalData1?.err || 'No data',
                finalData2?.err || 'No data',
                finalData3?.err || 'No data'
            ));
        }

    } catch (error) {
        // Roll back transaction on error
        if (dbCon) {
            await dbCon.query('ROLLBACK');
        }
        console.error('Error in getDashboardChartData:', error.stack);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
    // Note: No client.release() since dbCon is reused
};


// total  circle,zone,user,report counts on dashboard
// dashboardCtrl.getDashboardCount = async (req, res) => {

//     try {
//         if (!req.payload.USER_ID) {
//             res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "user id is required" }]));
//         }
//         const result = await dbCon.execute(
//             `BEGIN GET_DASHBOARD_COUNTS(:P_USERID,:A_CURSOR); END;`,
//             {
//                 P_USERID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
//                 A_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
//             },
//             {});
//         const finalData = await commonFunction.getResultSet(result.outBinds.A_CURSOR);
//         //console.log(finalData, "finalData")
//         if (finalData) {
//             res.end(commonFunction.getSuccessResponse(finalData, ''));
//         } else {
//             res.end(commonFunction.getErrorResponse(finalData.err));
//         }
//     } catch (error) {
//         console.log(error)
//         res.end(commonFunction.getErrorResponse(error));
//     }
// }

dashboardCtrl.getDashboardCount = async (req, res) => {
    try {
        // Wait for dbCon to be assigned
        await myCon;

        if (!dbCon) {
            throw new Error("Database connection not established");
        }

        // Validate USER_ID
        if (!req.payload.USER_ID) {
            return res.end(commonFunction.getErrorResponse([{ "err": "X", "msg": "user id is required" }]));
        }

        // Start transaction
        await dbCon.query('BEGIN');
        // Call the PostgreSQL stored procedure
        const queryText = 'CALL GET_DASHBOARD_COUNTS($1, $2)';
        const queryValues = [req.payload.USER_ID, 'a_cursor'];
        await dbCon.query(queryText, queryValues);

        // Fetch data from the cursor
        const aCursorResult = await dbCon.query('FETCH ALL IN a_cursor');
        // Commit transaction
        await dbCon.query('COMMIT');

        // Process cursor result
        const finalData = await commonFunction.getResultSet(aCursorResult.rows);

        // Check if data is valid
        if (finalData) {
            res.end(commonFunction.getSuccessResponse(finalData, ''));
        } else {
            res.end(commonFunction.getErrorResponse(finalData?.err || 'No data'));
        }

    } catch (error) {
        // Roll back transaction on error
        if (dbCon) {
            await dbCon.query('ROLLBACK');
        }
        console.error('Error in getDashboardCount:', error.stack);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
    // Note: No client.release() since dbCon is reused
};

module.exports = dashboardCtrl;