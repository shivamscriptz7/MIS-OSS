/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 20/06/2023
 * Author:Kajal Gulyani
 * Author: Rahul Kumar
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */

"use strict";
const connection = require("../CommonFiles/connection").dbConnection;
const permCtrl = {};
const oracledb = require("oracledb");
const auth = require("../CommonFiles/authService");
const commonFunction = require("../CommonFiles/commonFunction");
const CryptoJS = require("crypto-js");
// const _ = require("underscore");
var dbCon;

var myCon = connection.then((connection) => {
    dbCon = connection;
});

permCtrl.customValidations = (req, res, validation_obj) => {
    for (let i = 0; i < validation_obj.length; i++) {
        //check key is available or not in req.body
        if (req.body[Object.keys(validation_obj[i])]) {
            let bodyVaule = req.body[Object.keys(validation_obj[i])];
            if (typeof Object.values(validation_obj[i])[0][2] == typeof bodyVaule) {
                // console.log(Object.values(validation_obj[i])[0][0], "Object.values(validation_obj[i])[0][0]")
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

// used for get module list
permCtrl.getModuleList = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_MODULE_LIST(:CUR_DATA);END;`,
            {
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
                "module List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

// used for get module list
permCtrl.getMenupermissions = async (req, res) => {

    let usr = parseJwt(req.headers.authorization);
    let user_name = usr.USER_NAME;

    try {
        if (!user_name) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "user name is required field." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_MENU_PERMISSIONS(:user_name,:CUR_DATA,:P_CURSOR);END;`,
                {
                    user_name: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: user_name,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );

            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            const permData = await commonFunction.getResultSet(
                result.outBinds.P_CURSOR
            );
            res.end(commonFunction.getLoginSuccessResponse(finalData, "", permData));
        }
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

permCtrl.getMenupermissions_old = async (req, res) => {


    try {
        if (!req.query.USER_NAME) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "user name is required field." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_MENU_PERMISSIONS(:user_name,:CUR_DATA,:P_CURSOR);END;`,
                {
                    user_name: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.USER_NAME,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );

            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            const permData = await commonFunction.getResultSet(
                result.outBinds.P_CURSOR
            );
            res.end(commonFunction.getLoginSuccessResponse(finalData, "", permData));
        }
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};

// used for get module list based on report
permCtrl.getModuleListBasedOnReport = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_MODULE_LIST_BASEDON_REPORT(:CUR_DATA);END;`,
            {
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
                "module List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};
// get all role permissions
permCtrl.getAllRolePermissions_old = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_ALL_ROLE_PERMISSIONS(:CUR_DATA);END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        res.end(commonFunction.getSuccessResponse(finalData, ""));
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};
// used for unassigned role list
permCtrl.getUnassignedRole = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_UNASSIGNED_ROLE_PERMISSIONS(:CUR_DATA);END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData));
        } else {
            res.end(commonFunction.getSuccessResponse(finalData, "", finalData[0]));
        }
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

// get  permissions by role id
permCtrl.getPermissionsByRoleId = async (req, res) => {
    try {
        if (!req.query.role_id) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "role id is required filed." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_PERMISSIONLIST_BYROLEID(:role_id,:CUR_DATA);END;`,
                {
                    role_id: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.role_id,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = {
                role_id: req.query.role_id,
                Data: await commonFunction.getResultSet(result.outBinds.CUR_DATA),
            };

            res.end(commonFunction.getSuccessResponse(finalData, "", ""));
        }
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

permCtrl.fetchActiveUsers = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_ACTIVE_USERS (:P_USER_ID,:CUR_DATA);END;`,
            {
                P_USER_ID: { dir: oracledb.BIND_IN, val: req.query.USER_ID },
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

/**this method used for types Data which assigned to user */
permCtrl.getRepoData = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_REPORT_DATA(:userId,:CUR_DATA);END;`,
            {
                userId: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.query.userId,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );
        const editResultData = await dbCon.execute(
            `BEGIN GET_USER_PERMISSIONS_TYPE_DATA(:P_USER_ID,:CUR_DATA);END;`,

            {
                P_USER_ID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.query.userId,
                },

                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },

            {}
        );

        const editData = await commonFunction.getResultSet(
            editResultData.outBinds.CUR_DATA
        );
        let responseData;

        if (req.query.flag == 2) {
            // Use For ViewScreen

            responseData = viewbuildTree(finalData, null, editData);
        } else {
            //Use For Add Edit Screen

            responseData = buildTree(finalData, null, editData);
        }

        res.end(
            commonFunction.getSuccessResponse(
                responseData,
                "",
                "Report List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

/**this method used for  get types and role wise menu Data  */
permCtrl.getRoleTypeMenu = async (req, res) => {
    try {
        if (!req.query.roleId) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "role id is required field." },
                ])
            );
        } else if (!req.query.userId) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "user id is required field." },
                ])
            );
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_ROLE_TYPE_WISE_MENUDATA(:roleId,:userId,:CUR_DATA);END;`,
                {
                    roleId: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.roleId,
                    },
                    userId: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        val: req.query.userId,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            let responseData = menuBuildTree(finalData);
            res.end(commonFunction.getLoginSuccessResponse(responseData, finalData, finalData));
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

permCtrl.getViewReportListing = async (req, res) => {
    try {
        const editResultData = await dbCon.execute(
            `BEGIN GET_USER_PERMISSIONS_TYPE_DATA(:P_USER_ID,:CUR_DATA);END;`,
            {
                P_USER_ID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.query.userId,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },

            {}
        );
        const editData = await commonFunction.getResultSet(
            editResultData.outBinds.CUR_DATA
        );
        const responseData = viewBuildTree(editData);
        res.end(
            commonFunction.getSuccessResponse(
                responseData,
                "",
                "Report List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

/**this function used for making parent children structure in add edit view */
function buildTree(data, parentId = null, editPermissionData) {
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
                children: buildTree(data, row.TYPE_ID, editPermissionData),
            };

            tree.push(node);
        }
    }
    return tree;
}

/**this function used for making parent childrens sturcture in view listing */
function viewbuildTree(data, parentId = null, editPermissionData) {
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
                children: viewbuildTree(data, row.TYPE_ID, editPermissionData),
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

function menuBuildTree(data, parentId = null) {
    const tree = [];
    for (const row of data) {
        if (row.PARENT_NAME === parentId) {
            const node = {
                display: row.MODULES_NAME,
                value: row.MODULES_NAME,
                parent_Id: row.PARENT_ID,
                parent_name: row.PARENT_NAME,
                read_access: row.READ_ACCESS,
                create_access: row.CREATE_ACCESS,
                edit_access: row.EDIT_ACCESS,
                delete_access: row.DELETE_ACCESS,
                routing: row.ROUTING,
                icon: row.ICON,
                type_id: row.MODULES_ID,
                children: menuBuildTree(data, row.MODULES_NAME),
            };
            tree.push(node);
        }
    }
    return tree;
}

permCtrl.getTypeRepoData = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_USER_PERMISSIONS_TYPE_DATA(:P_USER_ID,:CUR_DATA);END;`,
            {
                P_USER_ID: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: req.query.userId,
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

/**this methos used for fetch list data and  */

permCtrl.fetchTypePermUserListingData = async (req, res) => {
    try {
        const data = req.query;
        const searchBy = data.search
            ? data.search
                .trim()
                .replace(/\\/g, "\\\\")
                .replace(/\"/g, '\\"')
                .replace(/\%/g, "\\%")
            : "";
        const result = await dbCon.execute(
            `BEGIN GET_TYPE_PERMISSION_LIST(:param_page,:param_size,:param_searchBy,:P_CURSOR,:Q_CURSOR);END;`,
            {
                param_page: { dir: oracledb.BIND_IN, val: data.page },
                param_size: { dir: oracledb.BIND_IN, val: data.size },
                param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.P_CURSOR
        );
        const finalDataCount = await commonFunction.getResultSet(
            result.outBinds.Q_CURSOR
        );
        const results = {
            total: finalDataCount,
            data: finalData,
        };
        res.end(
            commonFunction.getSuccessResponse(
                results,
                "",
                "Report List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

/**this function used for delete type permission */
permCtrl.deleteTypePermission = async (req, res) => {
    try {
        let userID = req.body.USER_ID;
        let createdByUserIdLog = req.body.userId;
        let logDeleteReason = req.body.delete_reason;
        let paramLogAction = 'Delete';
        let userPerm = CryptoJS.AES.decrypt(
            req.headers.permission,
            "Rw7]HwL5cXH$zkh"
        ).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) => item.module_id === 8);
        if (module[0].DELETE_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you don't have permissions" },
                ])
            );
        } else {


            let oldData = await getRepoDatalog(userID);
            const result = await dbCon.execute(
                `BEGIN DELETE_TYPE_PERMISSIONS(:P_USER_ID,:P_CREATED_BY,:CUR_DATA);END;`,
                {
                    P_USER_ID: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: req.body.USER_ID,
                    },
                    P_CREATED_BY: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.body.userId },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            if (finalData[0].ERR == "X") {
                res.end(commonFunction.getErrorResponse(finalData));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, "", finalData[0]));
                let newData = await getRepoDatalog(userID);
                await addUpdateDataLog(oldData, newData, userID, createdByUserIdLog, paramLogAction, logDeleteReason);
            }
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

// used for add update type Permissions
permCtrl.addUpdateTypePermissions = async (req, res) => {
    try {

        // use for get user id from user  headers.authorization
        let userAuthorization = parseJwt(req.headers.authorization);
        let userId = userAuthorization.USER_ID;

        let userPerm = CryptoJS.AES.decrypt(
            req.headers.permission,
            "Rw7]HwL5cXH$zkh"
        ).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) => item.module_id === 8);
        let data = req.body;
        let str = data.stringData.toString();


        let strArryData = str.split('#').map(e => e.split(',').map(e1 => +e1))
        let strFinaldata = strArryData.sort((a, b) => a[1] - b[1]).join('#').toString();
        // strArryData.sort((a, b) => a[1] - b[1]).join('#')
        let userID = parseInt(str?.split(',')[0]);
        let createdByUserIdLog = data.userId;

        let index = 0;
        data?.moduleArr?.forEach((element) => {
            // element.SUB_MODULES.forEach((e2) => {
            let arr = Object.values(element);
            let arr1 = [];
            for (let i = 1; i < arr.length - 2; i++) {
                arr[i] == true
                    ? (arr1[i] = 1)
                    : arr[i] == false
                        ? (arr1[i] = 0)
                        : (arr1[i] = arr[i]);
            }
            str =
                index == 0
                    ? data.role_id + arr1.toString()
                    : str + "#" + data.role_id + arr1.toString();
            index = 1;
            // })
        });
        //

        if (data.msgFlag == 0 && module[0].CREATE_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you don't have permissions" },
                ])
            );
        } else if (data.msgFlag != 0 && module[0].EDIT_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you don't have permissions" },
                ])
            );
        } else if (data.role_id == paredData.ROLE_ID) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you can not change your own permissions" },
                ])
            );
        } else {

            // use for get old type permisisnos data
            let oldData = await getRepoDatalog(userID);
            let paramLogAction;
            const result = await dbCon.execute(
                `BEGIN ADD_UPDATE_TYPE_PERMISSION(:P_VALUE,:P_USERID,:P_FLAG,:CUR_DATA);END;`,
                {
                    P_VALUE: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: strFinaldata },
                    P_USERID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                    P_FLAG: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: data.msgFlag,
                    },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },

                {}
            );
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);


            if (finalData[0].ERR == "X") {
                res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, "", finalData[0].MSG));
                finalData[0].LOG_ACTION_FLAG === 1 ? paramLogAction = 'Insert' : paramLogAction = 'Update';
                let newData = await getRepoDatalog(userID);
                await addUpdateDataLog(oldData, newData, userID, createdByUserIdLog, paramLogAction);
            }
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

//---------------code--------------

// used for add update role Permissions
permCtrl.addUpdateRolePermissions = async (req, res) => {
    try {
        // use for get user id from user  headers.authorization
        let userAuthorization = parseJwt(req.headers.authorization);
        let userId = userAuthorization.USER_ID;

        let userPerm = CryptoJS.AES.decrypt(
            req.headers.permission,
            "Rw7]HwL5cXH$zkh"
        ).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);

        for (let num = 0; num < req.body.moduleArr.length; num++) {
            if (
                req.body.moduleArr[num].READ_ACCESS == false ||
                req.body.moduleArr[num].READ_ACCESS == 0
            ) {
                if (
                    req.body.moduleArr[num].CREATE_ACCESS == 1 ||
                    req.body.moduleArr[num].EDIT_ACCESS == 1 ||
                    req.body.moduleArr[num].DELETE_ACCESS == 1 ||
                    req.body.moduleArr[num].CREATE_ACCESS == true ||
                    req.body.moduleArr[num].EDIT_ACCESS == true ||
                    req.body.moduleArr[num].DELETE_ACCESS == true
                ) {
                    return res.end(
                        commonFunction.getErrorResponse([
                            {
                                ERR: "X",
                                MSG: "Invalid data in: " + req.body.moduleArr[num]?.module,
                            },
                        ])
                    );
                }
            }
        }
        let module = parsedModules.filter((item) => item.module_id === 8);
        let data = req.body;





        for (let num = 0; num < req.body.moduleArr.length; num++) {
            if (
                req.body.moduleArr[num].READ_ACCESS == false ||
                req.body.moduleArr[num].READ_ACCESS == 0
            ) {
                if (
                    req.body.moduleArr[num].CREATE_ACCESS == 1 ||
                    req.body.moduleArr[num].EDIT_ACCESS == 1 ||
                    req.body.moduleArr[num].DELETE_ACCESS == 1 ||
                    req.body.moduleArr[num].CREATE_ACCESS == true ||
                    req.body.moduleArr[num].EDIT_ACCESS == true ||
                    req.body.moduleArr[num].DELETE_ACCESS == true
                ) {
                    return res.end(
                        commonFunction.getErrorResponse([
                            {
                                ERR: "X",
                                MSG: "Invalid data in: " + req.body.moduleArr[num]?.module,
                            },
                        ])
                    );
                }
            }
        }

        let str = '';
        let index = 0;

        data?.moduleArr?.forEach((element) => {
            // element.SUB_MODULES.forEach((e2) => {
            let arr = Object.values(element);
            let arr1 = [];
            for (let i = 1; i < arr.length - 2; i++) {
                arr[i] == true ? (arr1[i] = 1) : arr[i] == false ? (arr1[i] = 0) : (arr1[i] = arr[i]);
            }
            str =
                index == 0
                    ? data.role_id + arr1.toString()
                    : str + "#" + data.role_id + arr1.toString();
            index = 1;
            // })
        });

        let strArryData = str.split('#').map(e => e.split(',').map(e1 => +e1))
        let strFinaldata = strArryData.sort((a, b) => a[1] - b[1]).join('#').toString();


        // use this loop for validate all permissions value there is only 0 or 1 then valid other wise invalid.
        for (let i = 0; i < strArryData.length; i++) {
            let subArray = strArryData[i];
            // Check the values at index 2, 3, 4, and 5
            for (let j = 2; j <= 5; j++) {
                if (subArray[j] !== 0 && subArray[j] !== 1) {
                    res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Invalid data." }]));
                    return;
                }
            }
        }


        if (data.msgFlag == 0 && module[0].CREATE_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you don't have permissions" },
                ])
            );
        } else if (data.msgFlag != 0 && module[0].EDIT_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you don't have permissions" },
                ])
            );
        } else if (data.role_id == paredData.ROLE_ID) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you can not change your own permissions" }]));
        }
        else if (module[0].READ_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you can not Edit  permissions" }]));
        }
        else {
            const result = await dbCon.execute(
                `BEGIN ADD_UPDATE_ROLE_PERMISSION(:P_USER_ID,:moduleArr,:CUR_DATA,:msgFlag);END;`,
                {
                    P_USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                    moduleArr: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: strFinaldata },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    msgFlag: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        val: data.msgFlag,
                    },
                },

                {}
            );
            const finalData = await commonFunction.getResultSet(
                result.outBinds.CUR_DATA
            );
            if (finalData[0].ERR == "X") {
                res.end(
                    commonFunction.getErrorResponse(
                        finalData,
                        finalData[0].ERR,
                        finalData[0].MSG
                    )
                );
            } else {
                res.end(
                    commonFunction.getSuccessResponse(finalData, "", finalData[0].MSG)
                );
            }
        }
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};

// used for delete role permiussions
permCtrl.deleteRolePerm = async (req, res) => {
    try {
        let userPerm = CryptoJS.AES.decrypt(
            req.headers.permission,
            "Rw7]HwL5cXH$zkh"
        ).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) => item.module_id === 8);
        let data_obj = [{ ROLE_ID: [/^.{1,100}$/, 1, 1] }];
        if (module[0].DELETE_ACCESS == 0) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you don't have permissions" },
                ])
            );
        } else if (paredData.ROLE_ID == req.body.ROLE_ID) {
            res.end(
                commonFunction.getErrorResponse([
                    { ERR: "X", MSG: "you can not change your own permissions" },
                ])
            );
        } else {
            let validation = permCtrl.customValidations(req, res, data_obj);
            if (validation == 0) {
                const result = await dbCon.execute(
                    `BEGIN DELETE_ROLE_PERMISSIONS(:P_USER_ID,:param_role_id,:PARAM_DELETE_REASON,:CUR_DATA);END;`,
                    {

                        P_USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.body.userId },
                        param_role_id: {
                            dir: oracledb.BIND_IN,
                            type: oracledb.NUMBER,
                            val: req.body.ROLE_ID,
                        },
                        PARAM_DELETE_REASON: {
                            dir: oracledb.BIND_IN,
                            type: oracledb.STRING,
                            val: req.body.delete_reason,
                        },
                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                    },
                    {}
                );
                const finalData = await commonFunction.getResultSet(
                    result.outBinds.CUR_DATA
                );
                if (finalData[0].ERR == "X") {
                    res.end(commonFunction.getErrorResponse(finalData));
                } else {
                    res.end(
                        commonFunction.getSuccessResponse(finalData, "", finalData[0])
                    );
                }
            } else {
                res.end(commonFunction.getErrorResponse(validation));
            }
        }
    } catch (error) {
        console.log(error);
        res.end(commonFunction.getErrorResponse(error));
    }
};

permCtrl.getAllRolePermissions = async (req, res) => {
    try {
        const data = req.query;
        const searchBy = data.search
            ? data.search
                .replace(/\\/g, "\\\\")
                .replace(/\"/g, '\\"')
                .replace(/\%/g, "\\%")
            : "";
        const result = await dbCon.execute(
            `BEGIN GET_ROLE_PERMISSION_LIST(:param_page,:param_size,:param_searchBy,:P_CURSOR,:Q_CURSOR);END;`,
            {
                param_page: { dir: oracledb.BIND_IN, val: data.page },
                param_size: { dir: oracledb.BIND_IN, val: data.size },
                param_searchBy: { dir: oracledb.BIND_IN, val: searchBy },
                P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.P_CURSOR
        );
        const finalDataCount = await commonFunction.getResultSet(
            result.outBinds.Q_CURSOR
        );
        const results = {
            total: finalDataCount,
            data: finalData,
        };

        res.end(
            commonFunction.getSuccessResponse(
                results,
                "",
                "Role List Fetch Successfully"
            )
        );
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
};



// NEWWWWWWWWWWW





/**this method used for types Data which assigned to user */
async function getRepoDatalog(userId) {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_REPORT_DATA(:userId,:CUR_DATA);END;`,
            {
                userId: {
                    dir: oracledb.BIND_IN,
                    // type: oracledb.STRING,
                    val: userId,
                },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {}
        );
        const finalData = await commonFunction.getResultSet(
            result.outBinds.CUR_DATA
        );

        const editResultData = await dbCon.execute(
            `BEGIN GET_USER_PERMISSIONS_TYPE_DATA(:P_USER_ID,:CUR_DATA);END;`,

            {
                P_USER_ID: {
                    dir: oracledb.BIND_IN,

                    val: userId,
                },

                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },

            {}
        );

        const editData = await commonFunction.getResultSet(
            editResultData.outBinds.CUR_DATA
        );
        let responseData;
        responseData = await buildTree(finalData, null, editData);
        return responseData;
    } catch (error) {
        // res.end(commonFunction.getErrorResponse(error));
        console.log(error);
    }
};




async function addUpdateDataLog(oldData, newData, userId, createdByUserIdLog, paramLogAction, logDeleteReason) {
    try {
        const result = await dbCon.execute(
            `BEGIN ADD_TYPE_PERMISSION_OLD_VALUE_LOG(:USER_ID,:LOG_CREATED_BY_USER_ID,:P_LOG_ACTION,:LOG_OLD_VALUES,:LOG_NEW_VALUES,:PARAM_LOG_DEL_REASON,:CUR_DATA);END;`,
            {
                USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
                LOG_CREATED_BY_USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: createdByUserIdLog },
                P_LOG_ACTION: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: paramLogAction },
                LOG_OLD_VALUES: { dir: oracledb.BIND_IN, type: oracledb.CLOB, val: JSON.stringify(oldData) },
                LOG_NEW_VALUES: { dir: oracledb.BIND_IN, type: oracledb.CLOB, val: JSON.stringify(newData) },
                PARAM_LOG_DEL_REASON: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: logDeleteReason },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },

            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);


    } catch (error) {
        console.log(error, 'err')
    }

}

module.exports = permCtrl;
