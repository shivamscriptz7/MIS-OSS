/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 28/04/2023
 * Author: Rahul Kumar,Kajal Gulyani
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */
const path = require("path");
const axios = require("../CommonFiles/axios")
const connection = require("../CommonFiles/connection").dbConnection;
const reportCtrl = {};
const oracledb = require("oracledb");
const fs = require("fs");
const commonFunction = require("../CommonFiles/commonFunction");
const CryptoJS = require("crypto-js");
const repoUrl = require("../../../config.json");
var dbCon;
var myCon = connection.then((connection) => {
    dbCon = connection;
});

reportCtrl.customValidations = (req, res, validation_obj) => {
    for (let i = 0; i < validation_obj.length; i++) {
        //check key is available or not in req.body
        if (req.body[Object.keys(validation_obj[i])]) {
            let bodyVaule = req.body[Object.keys(validation_obj[i])];
            if (typeof Object.values(validation_obj[i])[0][2] == typeof bodyVaule) {
                if (
                    !Object.values(validation_obj[i])[0][0].test(
                        typeof bodyVaule == typeof "" ? bodyVaule?.trim() : bodyVaule
                    )
                ) {
                    return [
                        {
                            ERR: "X",
                            MSG: "Enter " + Object.keys(validation_obj[i]) + " valid data.",
                        },
                    ];
                }
            } else {
                return [
                    {
                        ERR: "X",
                        MSG:
                            Object.keys(validation_obj[i]) +
                            " Should be in " +
                            typeof Object.values(validation_obj[i])[0][2] +
                            " format.",
                    },
                ];
            }
            //check regex with req.body
        } else {
            //check required fields
            if (Object.values(validation_obj[i])[0][1] == 1) {
                return [
                    {
                        ERR: "X",
                        MSG: Object.keys(validation_obj[i]) + " is required field.",
                    },
                ];
            }
        }
    }
    return 0;
};

reportCtrl.fetchRepoData = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN SELECT_PLAN_WISE_REVENUE(:CUR_DATA);END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

// execute billing query
reportCtrl.executeBillingQuery = async (req, res) => {
    req.query = JSON.parse(req.query.dataSet);
    try {
        if (!req.query.selectedQuery) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "query is required." },
                ])
            );
        } else if (!req.query.type) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "type is required." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN get_billing_reports(:report_query,:report_type,:CUR_DATA);END;`,
                {
                    report_query: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.selectedQuery,
                    },
                    report_type: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.type,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            const finalData = await commonFunction.getResultSetExecuteQuery
                (
                    result.outBinds.CUR_DATA
                );
            res.end(commonFunction.getSuccessResponse(finalData));
        }
    } catch (error) {
        console.log(error, "error");
        res.end(commonFunction.getErrorResponse([{ 'ERR': error.toString() }]));
    }
};

reportCtrl.fetchReportList = async (req, res) => {
    try {
        let typeID = parseInt(req.query.typeId);

        if (!typeID) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "type id is required." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_TYPE_USER_WISE_REPORT(:P_TYPE_ID,:P_USER_ID,:CUR_DATA);END;`,
                {
                    P_TYPE_ID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: typeID,
                    },
                    P_USER_ID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: req.payload.USER_ID,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );

            res.end(commonFunction.getSuccessResponse(finalData));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

// fetch billing report list
// created by Kajal Gulyani 21-08-2023
reportCtrl.fetchReportListData = async (req, res) => {
    try {
        if (!req.query.type_id) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "type id is required." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_BILLING_REPORTS_USER_WISE(:P_TYPE_ID,:P_USER_ID,:CUR_DATA);END;`,
                {
                    P_TYPE_ID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: Number(req.query.type_id),
                    },
                    P_USER_ID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: req.payload.USER_ID,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            res.end(commonFunction.getSuccessResponse(finalData));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

reportCtrl.REP12PLANWISEREVENUE = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        const result = await dbCon.execute(
            `BEGIN REPO_PLAN_WISE_REVENUE(:P_REPOID,:P_CIRCLE,:P_CircleName,:P_SSA,:P_SSAName,:P_REPOTYPE,:CUR_DATA);END;`,
            {
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.RepoId,
                },
                P_CIRCLE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.Circle,
                },
                P_CircleName: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.CircleName,
                },
                P_SSA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.SSA },
                P_SSAName: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.SSAName,
                },
                P_REPOTYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

reportCtrl.SLR54CACCOUNTWISELISTOFOUTSTANDING = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_REPORT_54C_ACCT(:P_CIRCLE,:P_SSA,:P_REPOID,:P_REPO_TYPE,:P_BookingPeriod,:CUR_DATA);END;`,
            {
                P_CIRCLE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.Circle,
                },
                P_SSA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.SSA },
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.RepoId,
                },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                P_BookingPeriod: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.BookingPeriod,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_REP41PAYMENTSSUMMARY = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_REP_41_PAYMENTS_SUMMARY(:P_CIRCLE,:P_SSA,:P_REPOID,:P_REPO_TYPE,:P_BookingPeriod,:CUR_DATA);END;`,
            {
                P_CIRCLE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.Circle,
                },
                P_SSA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.SSA },
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.RepoId,
                },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                P_BookingPeriod: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.BookingPeriod,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_REPOAL1BILLSCANCELLED = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_AL1_BILLS_CANCELLED(:P_CIRCLE,:P_SSA,:P_REPOID,:P_REPO_TYPE,:P_BookingPeriod,:CUR_DATA);END;`,
            {
                P_CIRCLE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.Circle,
                },
                P_SSA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.SSA },
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.RepoId,
                },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                P_BookingPeriod: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.BookingPeriod,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_REPAL2BILLSWRITEOFFV1 = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_AL2_BILLS_WRITEOFFV1(:P_CIRCLE,:P_SSA,:P_REPOID,:P_REPO_TYPE,:P_BookingPeriod,:CUR_DATA);END;`,
            {
                P_CIRCLE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.Circle,
                },
                P_SSA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.SSA },
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.RepoId,
                },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                P_BookingPeriod: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: data.BookingPeriod,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECAREPLEDGRREVPOSTFX = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_A_REP_LEDGR_REV_POSTFX(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECBREPDISCORECOCLSEFX = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SECB_REP_DISCO_RECO_CLSE(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECCDISCOUNTS = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_C_DISCOUNTS(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};
reportCtrl.SLR_REPOSECDREPAGINGDETAILS = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_D_REP_AGING_DETAILS(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};
reportCtrl.SLR_SECEREPORTUNADJCREDITS = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_E_REPORT_UNADJ_CREDITS(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};
reportCtrl.SLR_SECGSUMRYUNALOCTDPAYMTS = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SECG_SUMRY_UNALOCTD_PAYMTS(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};
reportCtrl.SLR_SECHREPDETALSSURCHARGE = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_H_REP_DETALS_SURCHARGE(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECISERVICETAX = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_I_SERVICE_TAX(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECIGST = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_I_GST(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECIREPDETAILTAXOLD = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_I_REP_DETAIL_TAX_OLD(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_SECJREPREVSUBLEDACCT = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_SEC_J_REP_REV_SUBLED_ACCT(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

reportCtrl.SLR_EXCESSPAYMENTRECEIVED = async (req, res) => {
    try {
        let data = JSON.parse(req.query.data);
        let fromDt = new Date(data.FromDate);
        let toDt = new Date(data.ToDate);

        const result = await dbCon.execute(
            `BEGIN REPO_EXCESS_PAYMENTS_GST(:P_REPOID,:P_FROMDATE,:P_TODATE,:P_REPO_TYPE,:CUR_DATA);END;`,
            {
                P_REPOID: { dir: oracledb.BIND_IN, val: data.RepoId },
                P_FROMDATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: fromDt },
                P_TODATE: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: toDt },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

// get type list  in drop down
reportCtrl.getRepoTypeNameList = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_REPOTYPENAME_LIST(:CUR_DATA); END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            }
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

function typeNameDropDownTree(data, parentId = 0) {
    const tree = [];
    let isCheckedVar = false;
    for (const row of data) {
        if (row.PARENT_ID === parentId) {
            const node = {
                display: row.TYPE_NAME,
                value: row.TYPE_NAME,
                parent_Id: row.PARENT_ID,
                type_Id: row.TYPE_ID,
                //isSelected: isCheckedVar,
                children: typeNameDropDownTree(data, row.TYPE_ID),
            };
            tree.push(node);
        }
    }

    return tree;
}

// fetch type data
reportCtrl.fetchTypeNameData = async (req, res) => {
    try {
        const data = req.query;
        let userId = parseInt(data.userId);
        if (!userId) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "user id is required." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN Get_RepoTypeName_List (:P_USERID,:CUR_DATA);END;`,
                {
                    P_USERID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: userId,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            const responseData = typeNameDropDownTree(finalData);
            res.end(commonFunction.getSuccessResponse(responseData));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

// listing for report creation form
reportCtrl.getReportListing = async (req, res) => {
    try {
        const data = req.query;
        let userId = parseInt(data.userId);
        const sortType = data.ordering ? data.ordering.replace("-", "") : "";
        const searchBy = data.search
            ? data.search
                .replace(/\\/g, "\\\\")
                .replace(/\"/g, '\\"')
                .replace(/\%/g, "\\%")
            : "";
        const sortBy =
            data.ordering && data.ordering.indexOf("-") == 0 ? "DESC" : "ASC";
        if (!data.page) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "page is required filed" },
                ])
            );
        } else if (!data.size) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "size is required filed" },
                ])
            );
        } else if (!userId) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "user id is required filed" },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_REPORT_LIST(:P_USERID,:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:P_CURSOR,:Q_CURSOR);END;`,
                {
                    P_USERID: { dir: oracledb.BIND_IN, val: userId },
                    param_page: { dir: oracledb.BIND_IN, val: data.page },
                    param_size: { dir: oracledb.BIND_IN, val: data.size },
                    param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                    param_sortType: { dir: oracledb.BIND_IN, val: sortType },
                    param_sortBy: { dir: oracledb.BIND_IN, val: sortBy },
                    P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.P_CURSOR
            );
            const finalDatacount = await commonFunction.getResultSet(
                result.outBinds.Q_CURSOR
            );
            if (finalData) {
                res.end(
                    commonFunction.getSuccessResponse([finalData, finalDatacount], "", "")
                );
            } else {
                res.end(commonFunction.getErrorResponse(finalData.err));
            }
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

// to Active Delete api
reportCtrl.activeDeleteReport = async (req, res) => {
    let action_by = req.payload.USER_ID.toString();
    try {
        let data_obj = [
            { REPOID: [/^.{1,100}$/, 1, ""] },
            { action_type: [/^.{1,100}$/, 1, ""] },
            { action: [/^.{1,100}$/, 1, ""] },
        ];
        let validation = reportCtrl.customValidations(req, res, data_obj);
        let userPerm = CryptoJS.AES.decrypt(
            req.headers.permission,
            "Rw7]HwL5cXH$zkh"
        ).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) => item.module_id === 19);
        if (req.body.action_type == "active" && module[0].EDIT_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse({
                    ERR: "X",
                    MSG: "you don't  have permissions",
                })
            );
        } else if (
            req.body.action_type == "delete" &&
            module[0].DELETE_ACCESS == 0
        ) {
            res.end(
                commonFunction.getErrorResponse({
                    ERR: "X",
                    MSG: "you don't have permissions",
                })
            );
        } else if (validation == 0) {
            const result = await dbCon.execute(
                `BEGIN ACTIVE_DELETE_REPORT (:param_repoID,:action_type,:action,:action_by,:delete_reason,:CUR_DATA); END; `,
                {
                    param_repoID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.body.REPOID,
                    },
                    action_type: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.body.action_type,
                    },
                    action: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.body.action,
                    },
                    action_by: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: action_by,
                    },
                    delete_reason: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.body.delete_reason,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const aciveDeleteResult = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            if (aciveDeleteResult[0].ERR == "X") {
                res.end(
                    commonFunction.getLoginErrRes(
                        aciveDeleteResult,
                        aciveDeleteResult[0].ERR,
                        aciveDeleteResult[0].MSG
                    )
                );
            } else {
                res.end(
                    commonFunction.getSuccessResponse(
                        aciveDeleteResult,
                        "",
                        aciveDeleteResult[0].MSG
                    )
                );
            }
        } else {
            res.end(commonFunction.getErrorResponse(validation));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

reportCtrl.getFilterCircleData = async (req, res) => {
    try {
        //const data = req.query;
        let userId = req.payload.USER_ID;
        const result = await dbCon.execute(
            `BEGIN GET_FILTER_CIRCLE_DATA (:P_USERID,:CUR_DATA);END;`,
            {
                P_USERID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

reportCtrl.getFilterBaData = async (req, res) => {
    try {
        //const data = req.query;
        let userId = req.payload.USER_ID;
        if (!req.query.circle_id) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "circle id is required." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_FILTER_SSA_DATA (:P_USERID,:PARAM_CIRCLEID,:CUR_DATA);END;`,
                {
                    P_USERID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: userId,
                    },
                    PARAM_CIRCLEID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.circle_id,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            res.end(commonFunction.getSuccessResponse(finalData));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

reportCtrl.getSelectedRepoLink = async (req, res) => {
    try {
        if (!req.query.selectedRepoId) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "Report Id is required." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_SELECTED_REPORT_LINK (:PARAM_REPO_ID,:CUR_DATA);END;`,
                {
                    PARAM_REPO_ID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.selectedRepoId,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            res.end(commonFunction.getSuccessResponse(finalData));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

const exec = require("child_process").exec;
/**
 * Execution function
 * @Developer Shubham Joshi
 */
reportCtrl.execExecuteFunction = async (command) => {

    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 3168988 }, (error, stdout) => {
            //console.log(error, "error")
            //console.log(stdout, "stdout")
            if (error) {
                // console.log('Api reject: ' + error);
                resolve(JSON.parse(error));
            } else {
                resolve(stdout);
            }
        });
    });
};

reportCtrl.fetchREP_PLAN_WISE_REVENUE = async (req, res) => {
    try {

        const endPointurl = req.body.url;
        const apiReprtUrl = repoUrl.API_HOST + endPointurl;
        const authToken = repoUrl.AUTH_TOKEN;

        let fileExtension = "";
        const milliseconds = Date.now();
        //const projectRoot = process.cwd();
        const reportPath = path.join("uploads/SLR_REPORTS");


        //const reportPath = uploadFolderPath.replace("'','/'");
        fs.mkdirSync(reportPath, { recursive: true });
        if (req.body.extParam == "PDF" || req.body.extParam == "PDFDATA") {
            fileExtension = ".pdf";
        } else if (req.body.extParam == 'HTML') {
            fileExtension = ".html";
        } else if (req.body.extParam == 'EXCEL') {
            fileExtension = ".xls";
        }
        else if (req.body.extParam == 'CSV') {
            fileExtension = ".csv";
        }

        let file = req.body.repoName + '_' + milliseconds + fileExtension;
        let fileName = file.split(" ").join("_");

        const configData = {
            method: 'POST',
            url: apiReprtUrl,
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                BookingPeriod: req.body.BookingPeriod,
                Circle: req.body.Circle,
                RepoId: req.body.RepoId,
                RepoType: req.body.extParam,
                SSA: req.body.SSA,
                FromDate: req.body.FromDate,
                ToDate: req.body.ToDate,
                Sugarcane: req.body.Sugarcane
            },
            responseType: "stream"
        }

        axios.postAxios(configData).then((success) => {
            let headers = success.headers;
            // let Content = (headers.hasOwnProperty('Content-Disposition') ? 'Content-Disposition' : 'content-disposition');
            //var resFilename = "";
            //console.log("========================= ", headers);
            // console.log("--------------------------", Content);
            // console.log("++++++++++++++++++++++=", headers[Content]);
            // if (headers[Content] && headers[Content].indexOf('attachment') !== -1) {
            //     var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            //     var matches = filenameRegex.exec(headers[Content]);
            //     if (matches != null && matches[1]) resFilename = matches[1].replace(/['"]/g, '');
            // }

            success.data.pipe(fs.createWriteStream(`${reportPath}/${fileName}`));
            setTimeout(() => {
                const fileStream = fs.createReadStream(`${reportPath}/${fileName}`);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
                fileStream.pipe(res);
            }, 100);

        }).catch((error) => {
            console.log("Error", error.message);
            res.end(JSON.stringify({ "err": "X", "msg": error.message }));
        });

    } catch (error) {
        console.log(error);
    }
};
// reportCtrl.test();



getExcelExport = async (req, res) => {
    try {

        let Proc_Parms = ":P_CIRCLE,:P_SSA,:P_REPOID,:P_REPO_TYPE,:P_BookingPeriod,:CUR_DATA"
        const result = await dbCon.execute(
            `BEGIN ${req.body.REPO_PROC} (${Proc_Parms});END;`,
            {
                P_CIRCLE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.body.Circle,
                },
                P_SSA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.SSA },
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.body.RepoId,
                },
                P_REPO_TYPE: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "EXCEL",
                },
                P_BookingPeriod: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.body.BookingPeriod,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSetManually(
            result.outBinds.CUR_DATA
        );

        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
    }
};

// it is used for show assign report  count when we delete report.
reportCtrl.getAssignReportCount = async (req, res) => {
    try {
        let reportId = req.query.REPOID;
        const result = await dbCon.execute(
            `BEGIN GET_ASSIGN_REPORT_COUNT (:P_REPOID,:CUR_DATA);END;`,
            {
                P_REPOID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: reportId,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const finalData = await commonFunction.getResultSetManually(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData));
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

reportCtrl.UNLINK_SLR_REPORT = async (req, res) => {
    try {

        let filename = req.query.filename;
        const projectRoot = process.cwd();
        const reportPath = path.join(`uploads/SLR_REPORTS/${filename}`);
        fs.unlink(reportPath, (error, remove) => {
            if (error) {
                console.error('Error deleting file:', error);
                res.end(commonFunction.getErrorResponse(error));
            } else {
                res.end(commonFunction.getSuccessResponse('File deleted susccessfully'));

            }
        });

    } catch (error) {
        console.log(error);
    }
};


//delete keys in reorderedObject 
function removeMissingKeys(reorderedObject, filterParam) {
    for (let key in reorderedObject) {
        if (!(key in filterParam)) {
            delete reorderedObject[key];
        }
    }
}


reportCtrl.fetch_SLR_EXCEL_EXPORT = async (req, res) => {

    try {
        let data = req.body;
        if (data.filterParam.Circle?.length != 0) {
            delete data.filterParam['Circle'];
        }
        if (data.filterParam.SSA?.length != 0) {
            delete data.filterParam['SSA'];
        }


        const reorderedObject = {
            CircleName: data.filterParam.CircleName,
            SSAName: data.filterParam.SSAName,
            RepoId: data.filterParam.RepoId,
            RepoType: data.filterParam.RepoType,
            Sugarcane: data.filterParam.Sugarcane,
            BookingPeriod: data.filterParam.BookingPeriod,
        };

        removeMissingKeys(reorderedObject, data.filterParam);


        let Proc_Parms = "";
        let paramval = {}
        Object.keys(reorderedObject).forEach((key) => {
            Proc_Parms = Proc_Parms == '' ? (':' + key + ',') : (Proc_Parms + ':' + key + ',')
            paramval[key] = {
                dir: oracledb.BIND_IN,
                type: oracledb.STRING,
                val: reorderedObject[key],
            }
        });
        Proc_Parms += ':CUR_DATA';
        const result = await dbCon.execute(
            `BEGIN ${data.REPO_PROC} (${Proc_Parms});END;`,
            {
                ...paramval,
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

            },
            {}
        );

        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );

        res.end(commonFunction.getSuccessResponse(finalData));

    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
}

module.exports = reportCtrl;
