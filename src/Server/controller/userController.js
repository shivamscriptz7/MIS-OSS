/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 13/04/2023
 * Author:Kajal Gulyani
 * Contact: Echelon Edge MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */
"use strict"
const { dbConnection } = require('../CommonFiles/connection');
// const pool = require('../CommonFiles/connection');
const userCtrl = {};
const oracledb = require('oracledb');
const auth = require("../CommonFiles/authService");
const commonFunction = require("../CommonFiles/commonFunction");
const CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
const mail = require('../CommonFiles/mailService');
const { async, catchError } = require('rxjs');
const socketService = require('../CommonFiles/socket_server')
var dbCon;
const sceretEncrypt_Decryptkey = require('../../../config.json')

// const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(echelonedge.com)$/
const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._-]+@(echelonedge.com)$/
const singleSpaceValidation = /^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,50}$/
//const singleSpace = /^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,50}$/

//const alphabet=
// var myCon = connection.then((connection) => {
//     dbCon = connection;
// });


userCtrl.customValidations = (req, res, validation_obj) => {
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

userCtrl.customValidationSignIn = (req, res, validation_obj) => {
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
                return ([{ ERR: 'X', MSG: "Username & Password is required field." }]);
            }
        }
    }
    return 0;

}


userCtrl.customValidationsNew = (req, res, validation_obj) => {
    for (let i = 0; i < validation_obj.length; i++) {
        //check key is available or not in req.body
        if (req.body.data[Object.keys(validation_obj[i])]) {
            let bodyVaule = req.body.data[Object.keys(validation_obj[i])];
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


userCtrl.customValidationsEncryptDecryption = (req, res, validation_obj) => {
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


// userCtrl.signIn = async (req, res) => {
//     try {
//         const { client } = await dbConnection;

//         // Validate input data
//         let validation = userCtrl.customValidationSignIn(req, res, [
//             { userName: [/^.{1,100}$/, 1, ""] },
//             { password: [/^.{1,100}$/, 1, ""] }
//         ]);



//         if (validation !== 0) {
//             return res.end(commonFunction.getErrorResponse(validation));
//         }

//         let { userName, password } = req.body;
//         let decryptedPassword = CryptoJS.AES.decrypt(password, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);

//         // const client = await pool.connect();
//         try {
//             await client.query('BEGIN');

//             // await client.query('CALL USER_LOGIN($1, $2, $3, $4)', [userName, decryptedPassword, 'CUR_DATA', 'P_CURSOR']);
//             await client.query('CALL get_users_info($1)', ['CUR_DATA']);

//             const curDataRes = await client.query('FETCH ALL IN "CUR_DATA"');
//             const finalData = curDataRes.rows;

//             // const pCursorRes = await client.query('FETCH ALL IN "P_CURSOR"');
//             console.log(finalData);
//             return;

//             const permData = pCursorRes.rows;

//             await client.query('COMMIT');

//             if (finalData[0].ERR === 'X') {

//                 return res.end(commonFunction.getLoginErrRes(finalData, finalData[0].ERR, finalData[0].MSG));
//             }


//             // Generate token for authentication
//             let token = auth.generateToken(finalData);
//             const responseObj = { token };
//             res.end(commonFunction.getLoginSuccessResponse(finalData, responseObj, permData));

//             console.log(responseObj);

//             if (socketService.isUserLoggedIn(finalData[0].USER_ID)) {
//                 socketService.singleUserLogout(finalData[0].USER_ID);
//             }
//             socketService.singleUserLogin(finalData[0].USER_ID);
//         } catch (innerError) {
//             await client.query('ROLLBACK');
//             throw innerError;
//         } finally {
//             client.release();
//         }

//     } catch (error) {

//         res.end(commonFunction.getErrorResponse(error.toString()));
//     }
// }








// userCtrl.signIn = async (req, res) => {
//     try {

//         oracledb.fetchAsString = [oracledb.CLOB];
//         // Validate input data
//         let validation = userCtrl.customValidationSignIn(req, res, [
//             { userName: [/^.{1,100}$/, 1, ""] },
//             { password: [/^.{1,100}$/, 1, ""] }
//         ]);



//         if (validation !== 0) {
//             return res.end(commonFunction.getErrorResponse(validation));
//         }

//         let { userName, password } = req.body;
//         let decryptedPassword = CryptoJS.AES.decrypt(password, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
//         const result = await dbCon.execute(
//             `BEGIN USER_LOGIN(:user_name,:user_pswd,:CUR_DATA,:P_CURSOR);END;`,
//             {
//                 user_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: userName },
//                 user_pswd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: decryptedPassword },
//                 CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//                 P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
//             }
//         );

//         const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
//         const permData = await commonFunction.getResultSet(result.outBinds.P_CURSOR);

//         if (finalData[0].ERR === 'X') {

//             return res.end(commonFunction.getLoginErrRes(finalData, finalData[0].ERR, finalData[0].MSG));
//         }


//         // Generate token for authentication
//         let token = auth.generateToken(finalData);
//         const responseObj = { token };
//         res.end(commonFunction.getLoginSuccessResponse(finalData, responseObj, permData));

//         if (socketService.isUserLoggedIn(finalData[0].USER_ID)) {
//             socketService.singleUserLogout(finalData[0].USER_ID);
//         }
//         socketService.singleUserLogin(finalData[0].USER_ID);

//     } catch (error) {

//         res.end(commonFunction.getErrorResponse(error.toString()));
//     }
// }









// function socketIo(userData) {
//     // Handle socket connections
//     io.on('connection', (socket) => {
//         console.log('New client connected');

//         // Handle login event
//         socket.on('login', (userData) => {
//             // Perform authentication logic here
//             console.log('User logged in:', userData);
//             // Emit event to notify the frontend about successful login
//             socket.emit('loginSuccess', userData);
//         });

//         // Handle disconnection
//         socket.on('disconnect', () => {
//             console.log('Client disconnected');
//         });
//     });

// }


// used for update user profile 













































userCtrl.signIn = async (req, res) => {
    try {
        const { client, release } = await dbConnection;

        console.log("start api")

        // Validate input data
        let validation = userCtrl.customValidationSignIn(req, res, [
            { userName: [/^.{1,100}$/, 1, ""] },
            { password: [/^.{1,100}$/, 1, ""] }
        ]);

        if (validation !== 0) {
            return res.end(commonFunction.getErrorResponse(validation));
        }

        let { userName, password } = req.body;
        let decryptedPassword = CryptoJS.AES.decrypt(password, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);

        // Begin transaction
        await client.query('BEGIN');

        console.log("start 2")

        // Execute the function
        await client.query(`CALL user_login($1, $2, $3, $4)`, [userName, decryptedPassword, 'cur_data', 'p_cursor']);
        console.log("after proc")

        // Fetch cursor results
        const curDataResult = await client.query('FETCH ALL FROM cur_data');
        const pCursorResult = await client.query('FETCH ALL FROM p_cursor');

        console.log(curDataResult, "curDataResult data")
        console.log(pCursorResult, "pCursorResult data")

        // Commit transaction
        await client.query('COMMIT');

        const finalData = curDataResult.rows;
        const permData = pCursorResult.rows;
        console.log(finalData, "final data")
        if (finalData[0].err === 'X') {
            return res.end(commonFunction.getLoginErrRes(finalData, finalData[0].err, finalData[0].msg));
        }

        // Generate token for authentication
        let token = auth.generateToken(finalData);
        const responseObj = { token };
        res.end(commonFunction.getLoginSuccessResponse(finalData, responseObj, permData));

        if (socketService.isUserLoggedIn(finalData[0].USER_ID)) {
            socketService.singleUserLogout(finalData[0].USER_ID);
        }
        socketService.singleUserLogin(finalData[0].USER_ID);



    } catch (error) {
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
};










userCtrl.updateUserProfile = async (req, res) => {

    try {
        let data_obj = [
            { first_name: [/^[a-zA-Z ]{0,50}$/, 1, ""] },
            { last_name: [/^[a-zA-Z ]{0,50}$/, 0, ""] },
            { user_contact: [/^((\\+91-?)|0)?[0-9]{10}$/, 1, ""] },
        ]
        let validation = userCtrl.customValidations(req, res, data_obj);

        if (validation == 0) {
            // let user_id = req.body.user_id.toString();
            let data = req.body;
            const result = await dbCon.execute(
                `BEGIN UPDATE_USER_PROFILE(:first_name,:last_name,:user_contact,:user_image,:user_id,:CUR_DATA);END;`,
                {
                    first_name: { dir: oracledb.BIND_IN, val: data.first_name?.trim() },
                    last_name: { dir: oracledb.BIND_IN, val: data.last_name?.trim() },
                    user_contact: { dir: oracledb.BIND_IN, val: data.user_contact?.trim() },
                    user_image: { dir: oracledb.BIND_IN, val: data.user_image },
                    user_id: { dir: oracledb.BIND_IN, val: data.user_id },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (finalData[0].ERR == 'X') {
                res.end(commonFunction.getLoginErrRes(finalData, finalData[0].ERR, finalData[0].MSG));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, '', ''));
            }
        }
        else {
            res.end(commonFunction.getErrorResponse(validation));
        }

    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}

// used for update user profile Pic
userCtrl.updateUserProfilePic = async (req, res) => {
    try {
        let data = req.body;
        const result = await dbCon.execute(
            `BEGIN UPDATE_USER_PROFILEPIC(:user_id,:user_image,:CUR_DATA);END;`,
            {
                user_id: { dir: oracledb.BIND_IN, val: data.user_id },
                user_image: { dir: oracledb.BIND_IN, val: data.user_image },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getLoginErrRes(finalData, finalData[0].ERR, finalData[0].MSG));
        } else {
            res.end(commonFunction.getSuccessResponse(finalData, '', ''));
        }

    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}

// used for reset password
userCtrl.resetUserPswd = async (req, res) => {

    try {
        let data_obj = [
            { user_id: [/^\d{1,15}$/, 1, 1] },
            { email_id: [emailRegex, 1, ""] },
            { new_pswd: [/^.{1,100}$/, 1, ""] }
        ]
        let validation = userCtrl.customValidations(req, res, data_obj);
        if (validation == 0) {
            let userId = req.body.user_id.toString();
            let pswdHistory = false;
            let { email_id, new_pswd, randomPswd } = req.body;
            let pswd = CryptoJS.AES.decrypt(new_pswd, sceretEncrypt_Decryptkey.encrypt_decryptKey);
            new_pswd = pswd.toString(CryptoJS.enc.Utf8);
            // let hashedPassword = bcrypt.hashSync(new_pswd, 8);
            const logresult = await dbCon.execute(
                `BEGIN get_user_pswd_log(:user_id,:user_pswd,:CUR_DATA);END;`,
                {
                    user_id: { dir: oracledb.BIND_IN, val: userId },
                    user_pswd: { dir: oracledb.BIND_IN, val: new_pswd },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});
            const logData = await commonFunction.getResultSet(logresult.outBinds.CUR_DATA);
            if (logData[0]?.ERR === 'X') {
                res.end(commonFunction.getLoginErrRes(logData, logData[0].ERR, logData[0].MSG));
            }
            else {
                const result = await dbCon.execute(
                    `BEGIN RESET_PSWD(:email_id,:new_password,:CUR_DATA);END;`,
                    {
                        email_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.email_id },
                        new_password: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: new_pswd },
                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                    },
                    {});
                const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
                if (finalData[0].ERR == 'X') {
                    res.end(commonFunction.getErrorResponse(finalData[0]));
                } else {
                    updatePswdLog(userId, new_pswd, userId);
                    res.end(commonFunction.getSuccessResponse(finalData, '', ''));


                }
            }
        } else {
            res.end(commonFunction.getErrorResponse(validation));
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}

// used for resetUser password from Userlisting
userCtrl.resetUserPassword = async (req, res) => {
    try {
        let pswd = generateRandomPswd();

        const result = await dbCon.execute(
            `BEGIN RESET_USER_PSWD(:email_id,:new_password,:CUR_DATA);END;`,
            {
                email_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.USER_EMAIL },
                new_password: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: pswd },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData[0]));
        } else {
            let obj = {
                html: userCtrl.sendEmailTempUserPass(req.body.USER_NAME, pswd),
                subject: "Welcome To EDGE MIS"
            };
            let x = mail.sendEmail(req.body.USER_EMAIL, obj).then(response =>
                response.msg).catch(error =>
                    res.status(500).send(error.message)
                );
            res.end(commonFunction.getSuccessResponse(finalData, '', ''));
        }



    } catch (error) {

    }
}

// used for forgot password
userCtrl.forgotPassword = async (req, res) => {
    try {
        let data_obj = [
            { email_id: [emailRegex, 1, ""] }
        ]
        let validation = userCtrl.customValidations(req, res, data_obj);
        if (validation == 0) {
            let pswd = generateRandomPswd();
            // let hashedPswd = bcrypt.hashSync(pswd, 8);
            const result = await dbCon.execute(
                `BEGIN GENERATE_PASSWORD(:email_id,:random_pswd,:CUR_DATA);END;`,
                {
                    email_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.email_id },
                    random_pswd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: pswd },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {});

            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (finalData[0].ERR === 'X') {
                res.end(commonFunction.getLoginErrRes(finalData[0], finalData[0].ERR, finalData[0].MSG));
            } else {
                let obj = {
                    html: userCtrl.sendEmailTempUserPass(finalData[0].USERNAME, pswd),
                    subject: "Welcome To EDGE MIS"
                };
                let x = mail.sendEmail(req.body.email_id, obj).then(response =>
                    response.msg).catch(error =>
                        res.status(500).send(error.message)
                    );
                res.end(commonFunction.getSuccessResponse(finalData, ''));
            }
        } else {
            res.end(commonFunction.getErrorResponse(validation));
        }
    }
    catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
}


// function used for generate random password
function generateRandomPswd(length = 8) {
    const Allowed = {
        Uppers: "QWERTYUIOPASDFGHJKLZXCVBNM",
        Lowers: "qwertyuiopasdfghjklzxcvbnm",
        Numbers: "1234567890",
        Symbols: "!@#$%^&*"
    }
    const getRandomCharFromString = (str) => str.charAt(Math.floor(Math.random() * str.length))

    let pwd = "";
    pwd += getRandomCharFromString(Allowed.Uppers); //pwd will have at least one upper
    pwd += getRandomCharFromString(Allowed.Lowers); //pwd will have at least one lower
    pwd += getRandomCharFromString(Allowed.Numbers); //pwd will have at least one number
    pwd += getRandomCharFromString(Allowed.Symbols);//pwd will have at least one symbolo
    for (let i = pwd.length; i < length; i++)
        pwd += getRandomCharFromString(Object.values(Allowed).join('')); //fill the rest of the pwd with random characters
    return pwd

}

// used for zone list
userCtrl.getZoneList = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_ZONE_LIST(:CUR_DATA);END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },

            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData));
        } else {
            res.end(commonFunction.getSuccessResponse(finalData, '', 'Zone List Fetch Successfully'));
        }

    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
}

// used for role list
userCtrl.getRoleList = async (req, res) => {
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
                `BEGIN GET_ROLE_LIST(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:P_CURSOR,:Q_CURSOR);END;`,
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


// used for type list
userCtrl.getTypeList = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN get_type_details(:CUR_DATA);END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },

            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData));
        } else {
            res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0]));
        }

    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }
}



// used for active delete user

userCtrl.activeDeleteUser = async (req, res) => {
    let userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
    let paredData = JSON.parse(userPerm);
    let parsedModules = JSON.parse(paredData.MODULES);
    let module = parsedModules.filter((item) =>
        item.module_id === 6);
    let action_by = req.payload.USER_ID.toString();
    try {
        if (module[0].EDIT_ACCESS == 0 && req.body.action_type == 'active') {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (module[0].DELETE_ACCESS == 0 && req.body.action_type == 'Delete') {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else {
            let data_obj = [
                { userId: [/^.{1,100}$/, 1, ""] },
                { action_type: [/^.{1,100}$/, 1, ""] },
                { action: [/^.{1,100}$/, 1, ""] }
            ]
            let validation = userCtrl.customValidations(req, res, data_obj);


            if (validation == 0) {
                const result = await dbCon.execute(
                    `BEGIN ACTIVE_DELETE_USER(:param_userID,:action_type,:action,:action_by,:del_reason,:CUR_DATA);END;`,
                    {
                        param_userID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.userId },
                        action_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action_type },
                        action: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action },
                        action_by: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: action_by },
                        del_reason: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.delete_reason },
                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                    },

                    {});

                const aciveDeleteResult = await commonFunction.getResultSet(result.outBinds.CUR_DATA);

                //console.log(req.body.userId, "hhhhhhhhhhh")
                if (aciveDeleteResult[0].ERR == 'X') {
                    res.end(commonFunction.getErrorResponse(aciveDeleteResult));
                } else {
                    socketService.deleteUserLogout(req.body.userId);
                    res.end(commonFunction.getSuccessResponse(aciveDeleteResult, '', aciveDeleteResult[0].MSG));

                }
            } else {
                res.end(commonFunction.getErrorResponse(validation));
            }
        }




    } catch (error) {
        console.log(error, 'error');
        res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": error }));
    }

}



// used for active delete role
userCtrl.activeDeleteRole = async (req, res) => {
    let action_by = req.payload.USER_ID.toString();
    try {
        let data_obj = [
            { role_id: [/^.{1,100}$/, 1, ""] },
            { action_type: [/^.{1,100}$/, 1, ""] },
            { action: [/^.{1,100}$/, 1, ""] }
        ]
        let validation = userCtrl.customValidations(req, res, data_obj);
        let userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) =>
            item.module_id === 7);
        if (req.body.action_type == 'active' && module[0].EDIT_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have role permissions " }]));
        } else if (req.body.action_type == 'delete' && module[0].DELETE_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have roleEdit permissions" }]));
        } else if (req.payload.USER_ROLE != req.body.user_role && req.body.user_role == 3) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You can not use this role id." }]));
        }
        else if (validation == 0) {
            const result = await dbCon.execute(
                `BEGIN ACTIVE_DELETE_ROLE(:param_roleID,:action_type,:action,:action_by,:delete_reason,:CUR_DATA);END;`,
                {
                    param_roleID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.role_id },
                    action_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action_type },
                    action: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.action },
                    action_by: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: action_by },
                    delete_reason: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.delete_reason },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }

                },

                {});
            const aciveDeleteResult = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (aciveDeleteResult[0].ERR == 'X') {

                res.end(commonFunction.getLoginErrRes(aciveDeleteResult, aciveDeleteResult[0].ERR, aciveDeleteResult[0].MSG));
            } else {
                res.end(commonFunction.getSuccessResponse(aciveDeleteResult, '', aciveDeleteResult[0].MSG));
            }
        } else {
            res.end(commonFunction.getErrorResponse(validation));
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}

// used for add update role purpose
userCtrl.addUpdateRole = async (req, res) => {
    try {
        let usr = parseJwt(req.headers.authorization);
        let created_updateBy = usr.USER_ID;

        let data_obj = [
            { role_id: [/^\d{1,15}$/, 0, 1] },
            { role_name: [/^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,50}$/, 1, ""] },
            { role_desc: [/^(?!\s)((?!\s{2}).)*$/, 0, ""] }
        ]
        let validation = userCtrl.customValidationsNew(req, res, data_obj);
        //let validation = true;
        let userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);

        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) =>
            item.module_id === 7);
        if (!req.body.data.role_id && module[0].CREATE_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "you don't have permissions" }));
        } else if (req.body.data.role_id && module[0].EDIT_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "you don't have permissions" }));
        } else if (req.payload.USER_ROLE != req.body.data.user_role && req.body.data.user_role == 3) { //user_role:= 3 is user role id of superadmin  
            res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "You can not use this role id." }));
        }
        else if (validation == 0) {


            let role_id = req.body.data.role_id.toString();
            const result = await dbCon.execute(
                `BEGIN ADD_UPDATE_ROLE(:role_id,:role_name,:role_desc,:role_created_by,:role_updated_by,:CUR_DATA);END;`,
                {
                    role_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: role_id },
                    role_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.data.role_name?.trim() },
                    role_desc: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.data.role_desc?.trim() },
                    role_created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: created_updateBy },
                    role_updated_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: created_updateBy },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (finalData[0].ERR == 'X') {
                res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
            }
        }
        else {
            res.end(commonFunction.getErrorResponse(validation));
        }
    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}

// used for get circle list 
userCtrl.getCircleList = async (req, res) => {
    try {
        if (!req.query.zone_id) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "zone id is required" }]));
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_CIRCLE_LIST(:zone_id,:CUR_DATA);END;`,
                {
                    zone_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.query.zone_id },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                },
                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            res.end(commonFunction.getSuccessResponse(finalData, '', 'Circle List Fetch Successfully'));
        }


    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }


}




// used for role list
userCtrl.getRoleForDropdown = async (req, res) => {
    try {
        const result = await dbCon.execute(
            `BEGIN GET_ROLE_FOR_DROPDOWN(:CUR_DATA);END;`,
            {
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            },
            {});
        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (finalData[0].ERR == 'X') {
            res.end(commonFunction.getErrorResponse(finalData));
        } else {
            res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0]));
        }
    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }

}

// used for city list based on zone and city
userCtrl.getCityList = async (req, res) => {
    try {
        if (!req.query.zone_id) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "zone  id required." }]));
        } else if (!req.query.circle_id) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "circle  id required." }]));
        } else {
            const result = await dbCon.execute(
                `BEGIN GET_CITY_LIST(:zone_id,:circle_id,:CUR_DATA);END;`,
                {
                    zone_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.query.zone_id },
                    circle_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.query.circle_id },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

                },

                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            if (finalData[0].ERR == 'X') {

                res.end(commonFunction.getErrorResponse(finalData));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, '', 'Circle List Fetch Successfully'));
            }
        }


    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }


}


// used for add update user backup
userCtrl.addUpdateUserBackup = async (req, res) => {
    try {
        let typeFlag = 0;
        if (req.body.user_id != '' && req.body.user_id != null) {
            let prevTypeValue = req.body.prevType.toString();
            let currTypeValue = req.body.type.toString();
            if (prevTypeValue != currTypeValue) { //user for type change
                typeFlag = 1;
            }
        }

        const firstName = req.body.first_name;
        if (firstName?.trim() === '') {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "First Name can not be null or empty. " }));
        }
        // return;
        let data_obj = [
            { user_id: [/^.{1,100}$/, 0, ''] },
            { user_name: [/^[a-z0-9_-]{2,50}$/, 1, ""] },
            { first_name: [/^[a-zA-Z ]{0,50}$/, 1, ""] },
            { last_name: [/^[a-zA-Z ]{0,50}$/, 0, ""] },
            { user_email: [emailRegex, 1, ""] },
            { user_contact: [/^((\\+91-?)|0)?[0-9]{10}$/, 1, ""] },
            { user_role: [/^\d+$/, 1, 1] },
            { zone: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { circle: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { type: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { ssa: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { prevType: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 0, ""] },

        ]

        let validation = userCtrl.customValidations(req, res, data_obj);
        let email = req.body.user_email.toLowerCase();
        let userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) =>
            item.module_id === 6);
        if (!req.body.user_id && module[0].CREATE_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (req.body.user_id && module[0].EDIT_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (req.payload.USER_ROLE != req.body.user_role && req.body.user_role == 3) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You can not use this role id." }]));
        }
        else {
            if (validation == 0) {
                let randomPswd = generateRandomPswd();
                // let hashedPswd = bcrypt.hashSync(randomPswd, 8);
                const result = await dbCon.execute(
                    `BEGIN ADD_UPDATE_USER(:user_id,:first_name,:last_name,:user_pswd,:user_name,:user_email,:user_contact,:user_role,:user_created_by,:user_updated_by,:CUR_DATA);END;`,
                    {
                        user_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_id },
                        user_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_name?.trim() },
                        first_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.first_name?.trim() },
                        last_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.last_name?.trim() },
                        user_pswd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: randomPswd },
                        user_email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email?.trim() },
                        user_contact: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_contact?.trim() },
                        user_role: { dir: oracledb.BIND_IN, val: req.body.user_role },
                        // user_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_type },
                        user_created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                        user_updated_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

                    },

                    {});
                const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);

                if (finalData[0].ERR == 'X') {
                    res.end(commonFunction.getErrorResponse(finalData));
                } else {
                    await addUpdateUserCircle(finalData[0].USERID, req.body.zone, req.body.circle, req.body.ssa);
                    await updateUserType(finalData[0].USERID, req.body.type, req.payload.USER_ID, typeFlag);
                    if (!req.body.user_id) {
                        let obj = {
                            html: userCtrl.sendEmailTempUserPass(req.body.user_name, randomPswd),
                            subject: "Welcome To EDGE MIS"
                        };
                        let x = mail.sendEmail(req.body.user_email, obj).then(response =>
                            response.msg).catch(error =>
                                res.status(500).send(error.message)
                            );
                        res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    } else {
                        res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    }


                }
            } else {
                res.end(commonFunction.getErrorResponse(validation));
            }
        }

    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}




// USE FOR LOGS 
userCtrl.addUpdateUser_old = async (req, res) => {
    try {
        let typeFlag = 0;


        if (req.body.user_id != '' && req.body.user_id != null) {
            let prevTypeValue = req.body.prevType.toString();
            let currTypeValue = req.body.type.toString();
            if (prevTypeValue != currTypeValue) { //user for type change
                typeFlag = 1;
            }
        }

        const firstName = req.body.first_name;
        if (firstName?.trim() === '') {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "First Name can not be null or empty. " }));
        }


        // return;
        let data_obj = [
            { user_id: [/^.{1,100}$/, 0, ''] },
            { user_name: [/^[a-z0-9_-]{2,50}$/, 1, ""] },
            { first_name: [/^[a-zA-Z ]{0,50}$/, 1, ""] },
            { last_name: [/^[a-zA-Z ]{0,50}$/, 0, ""] },
            { user_email: [emailRegex, 1, ""] },
            { user_contact: [/^((\\+91-?)|0)?[0-9]{10}$/, 1, ""] },
            { user_role: [/^\d+$/, 1, 1] },
            { zone: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { circle: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { type: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { ssa: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { prevType: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 0, ""] },

        ]



        let validation = userCtrl.customValidations(req, res, data_obj);
        let email = req.body.user_email.toLowerCase();
        let userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);

        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) =>
            item.module_id === 6);
        if (!req.body.user_id && module[0].CREATE_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (req.body.user_id && module[0].EDIT_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (req.payload.USER_ROLE != req.body.user_role && req.body.user_role == 3) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You can not use this role id." }]));
        }

        else {
            if (validation == 0) {
                let randomPswd = generateRandomPswd();
                // let hashedPswd = bcrypt.hashSync(randomPswd, 8);
                const result = await dbCon.execute(
                    `BEGIN ADD_UPDATE_USER(:user_id,:first_name,:last_name,:user_pswd,:user_name,:user_email,:user_contact,:user_role,:user_created_by,:user_updated_by,:PARAM_ZONEID,:circle_id,:ssa_id,:type_id,:typeFlag,:CUR_DATA);END;`,
                    {
                        user_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_id },
                        user_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_name?.trim() },
                        first_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.first_name?.trim() },
                        last_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.last_name?.trim() },
                        user_pswd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: randomPswd },
                        user_email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email?.trim() },
                        user_contact: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_contact?.trim() },
                        user_role: { dir: oracledb.BIND_IN, val: req.body.user_role },
                        // user_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_type },
                        user_created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                        user_updated_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                        // USE FOR ZONE CIRCLE DATA
                        PARAM_ZONEID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.zone },
                        circle_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.circle },
                        ssa_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.ssa },
                        // USE FOR TYPE 
                        type_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.type },
                        typeFlag: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: typeFlag },
                        // created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },

                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

                    },

                    {});
                const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);

                if (finalData[0].ERR == 'X') {
                    res.end(commonFunction.getErrorResponse(finalData));
                } else {
                    // await addUpdateUserCircle(finalData[0].USERID, req.body.zone, req.body.circle, req.body.ssa);
                    // await updateUserType(finalData[0].USERID, req.body.type, req.payload.USER_ID, typeFlag);
                    if (!req.body.user_id) {
                        let obj = {
                            html: userCtrl.sendEmailTempUserPass(req.body.user_name, randomPswd),
                            subject: "Welcome To EDGE MIS"
                        };
                        let x = mail.sendEmail(req.body.user_email, obj).then(response =>
                            response.msg).catch(error =>
                                res.status(500).send(error.message)
                            );
                        res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    } else {
                        res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    }


                }
            } else {
                res.end(commonFunction.getErrorResponse(validation));
            }
        }

    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}





userCtrl.addUpdateUser = async (req, res) => {
    try {

        let userData = CryptoJS.AES.decrypt(req.body.data, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let parseUserData = JSON.parse(userData);

        let typeFlag = 0;

        const sequence = updateDataObject(parseUserData);

        let usr = parseJwt(req.headers.authorization);
        let created_updateBy = usr.USER_ID;

        if (parseUserData.user_id != '' && parseUserData.user_id != null) {
            let prevTypeValue = parseUserData.prevType.toString();
            let currTypeValue = parseUserData.type.toString();
            if (prevTypeValue != currTypeValue) { //user for type change
                typeFlag = 1;
            }
        }

        const firstName = parseUserData.first_name;
        if (firstName?.trim() === '') {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "First Name can not be null or empty. " }));
        }

        let data_obj = [
            { user_id: [/^.{1,100}$/, 0, ''] },
            { user_name: [/^[a-z0-9_-]{2,50}$/, 1, ""] },
            { first_name: [/^[a-zA-Z ]{0,50}$/, 1, ""] },
            { last_name: [/^[a-zA-Z ]{0,50}$/, 0, ""] },
            { user_email: [emailRegex, 1, ""] },
            { user_contact: [/^((\\+91-?)|0)?[0-9]{10}$/, 1, ""] },
            { user_role: [/^\d+$/, 1, 1] },
            { zone: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { circle: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { type: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { ssa: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 1, ""] },
            { prevType: [/^(?:-1|[0-9]+([0-9]+)?(,[0-9]+([0-9]+)?)*)$/, 0, ""] },

        ]


        let validation = userCtrl.customValidationsEncryptDecryption(parseUserData, res, data_obj);
        let email = parseUserData.user_email.toLowerCase();
        let userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let paredData = JSON.parse(userPerm);
        let parsedModules = JSON.parse(paredData.MODULES);
        let module = parsedModules.filter((item) =>
            item.module_id === 6);
        if (!parseUserData.user_id && module[0].CREATE_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (parseUserData.user_id && module[0].EDIT_ACCESS == 0) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you don't have permissions" }]));
        } else if (req.payload.USER_ROLE != parseUserData.user_role && parseUserData.user_role == 3) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You can not use this role id." }]));
        }
        // else if ((parseUserData.user_id != '') && compareData == true) {
        //     res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "you can not update without any change." }]));
        // }
        else {
            if (validation == 0) {
                let randomPswd = generateRandomPswd();
                // let hashedPswd = bcrypt.hashSync(randomPswd, 8);
                const result = await dbCon.execute(
                    `BEGIN ADD_UPDATE_USER(:user_id,:first_name,:last_name,:user_pswd,:user_name,:user_email,:user_contact,:user_role,:user_created_by,:user_updated_by,:PARAM_ZONEID,:circle_id,:ssa_id,:type_id,:typeFlag,:CUR_DATA);END;`,
                    {
                        user_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseUserData.user_id },
                        user_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseUserData.user_name?.trim() },
                        first_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseUserData.first_name?.trim() },
                        last_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseUserData.last_name?.trim() },
                        user_pswd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: randomPswd },
                        user_email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email?.trim() },
                        user_contact: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: parseUserData.user_contact?.trim() },
                        user_role: { dir: oracledb.BIND_IN, val: parseUserData.user_role },
                        // user_type: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.body.user_type },
                        user_created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: created_updateBy },
                        user_updated_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: created_updateBy },
                        // USE FOR ZONE CIRCLE DATA
                        PARAM_ZONEID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: sequence.zone },
                        circle_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: sequence.circle },
                        ssa_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: sequence.ssa },
                        // USE FOR TYPE 
                        type_id: { dir: oracledb.BIND_IN, val: sequence.type },
                        typeFlag: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: typeFlag },
                        // created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },

                        CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

                    },

                    {});
                const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);

                if (finalData[0].ERR == 'X') {
                    res.end(commonFunction.getErrorResponse(finalData));
                } else {
                    // await addUpdateUserCircle(finalData[0].USERID, req.body.zone, req.body.circle, req.body.ssa);
                    // await updateUserType(finalData[0].USERID, req.body.type, req.payload.USER_ID, typeFlag);
                    if (!parseUserData.user_id) {
                        let obj = {
                            html: userCtrl.sendEmailTempUserPass(parseUserData.user_name, randomPswd),
                            subject: "Welcome To EDGE MIS"
                        };
                        let x = mail.sendEmail(parseUserData.user_email, obj).then(response =>
                            response.msg).catch((error) => {
                                res.status(500).send(error.message)

                            }

                            );
                        res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    } else {
                        res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
                    }


                }
            } else {
                res.end(commonFunction.getErrorResponse(validation));
            }
        }

    } catch (error) {
        //console.log(error)
        res.end(commonFunction.getErrorResponse(error.toString()));
    }
}



function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


// function used for update invalid pswd count
async function updateInvalidPswdCount(user_id, pswd_count) {
    const result = await dbCon.execute(
        `BEGIN add_update_invalid_psw_count(:user_id,:z,:CUR_DATA);END;`,
        {
            user_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: user_id },
            z: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: pswd_count },
            CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

        },

        {});
    const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
}

// function used for update pswd for history table
async function updatePswdLog(user_id, pswd, userId) {

    const result = await dbCon.execute(
        `BEGIN add_user_pswd_log(:user_id,:pswd,:created_by,:CUR_DATA);END;`,
        {
            user_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: user_id },
            pswd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: pswd },
            created_by: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: userId },
            CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

        },

        {});
    const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
}

// function used for update  user type
async function updateUserType(user_id, type_id, userId, typeFlag) {

    const result = await dbCon.execute(
        `BEGIN ADD_USER_TYPE(:user_id,:type_id,:typeFlag,:created_by,:CUR_DATA);END;`,
        {
            user_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: user_id },
            type_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: type_id },
            typeFlag: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: typeFlag },
            created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
            CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        {});
    const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
}

// function used for add update user circle
async function addUpdateUserCircle(user_id, zone_id, circle_id, ssa_id) {

    //try {
    const result = await dbCon.execute(
        `BEGIN ADD_USER_ZONE_CIRCLE(:user_id,:zone_id,:circle_id,:ssa_id,:CUR_DATA);END;`,
        {
            user_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: user_id },
            zone_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: zone_id },
            circle_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: circle_id },
            ssa_id: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ssa_id },
            CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

        },

        {});

    const circleData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);


}
userCtrl.sendEmailTempUserPass = (username, password) => {
    try {
        return `<html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0;">
            <meta name="format-detection" content="telephone=no"/>
            <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        
            <!-- Responsive Mobile-First Email Template by Konstantin Savchenko, 2015.
            https://github.com/konsav/email-templates/  -->
        
            <style>
        /* Reset styles */ 
        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
        body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        #outlook a { padding: 0; }
        .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        
        /* Rounded corners for advanced mail clients only */ 
        @media all and (min-width: 560px) {
            .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
        }
        @media all and (max-width: 768px) {
            .mb_responsive td{
                display: block;
                width: 100%!important;
                padding:30px 0px 0px!important;
            }   
            .mb_responsive td p{
                display: block!important;
                padding: 0px 20px;
            }
            .mb_responsive td span{
                padding: 0px 20px;
                margin-bottom: 8px!important;
                display: block;
            }
            .mb_responsive td p span{
                padding-left: 0px!important;
            }
            .mb_responsive td .box-sction{
                margin: 20px 20px!important;
            }
            .mb_responsive td .box-sction p {
               padding: 0px 10px;
            }
            .container {
                padding: 0 50px;
            }
        }
        
        /* Set color for auto links (addresses, dates, etc.) */ 
        a, a:hover {
            color: #127DB3;
        }
            </style>
        
            <!-- MESSAGE SUBJECT -->
            <title>Get this responsive email template</title>
        
        </head>
        
        <!-- BODY -->
        <!-- Set message background color (twice) and text color (twice) -->
        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;background-color: #FAFAFA;color: #000000;"bgcolor="#FAFAFA" text="#000000">
        
            <!-- SECTION / BACKGROUND -->
            <!-- Set message background color one again -->
            <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#FAFAFA">
        
                <!-- WRAPPER -->
                <!-- Set wrapper width (twice) -->
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="860" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit; max-width: 860px;" class="wrapper">
        
                    <tr>
                        <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0;padding: 0;padding-top:20px; padding-bottom: 20px;">                                 
                            <img border="0" vspace="0" hspace="0" src="https://i.ibb.co/XLXRCy6/logo.png"  width="100"  alt="Logo" title="Logo" 
                            style="color: #000000;font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; max-width:100px;width:100px;" />                            
                        </td>
                    </tr>
        
                </table>
        
                <table border="0" cellpadding="0" cellspacing="0" align="center"
                    bgcolor="#FFFFFF" width="860" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 860px; width: 100%; border: 1px solid #D9C9FF;" class="container">
        
                    <tr class="mb_responsive">
                        <td align="center" valign="middle" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  line-height: 130%;  padding-left: 6.25%; padding-top: 40px; text-align: left; width: 60%;" class="header">
                                <p style="color: #4a7d93;font-family: 'Poppins', sans-serif;font-size: 25px;font-weight: 600; margin: 0px;">Dear User !</p>
                                <span style="color: #000000;font-family: 'Poppins', sans-serif;font-size: 16px; margin: 0px; margin-top: 18px;font-weight: 600;display: block;">Your Username and Password</span>
                                <div class="box-sction" style="box-shadow: 0px 12px 24px #4a7d93;background-color: transparent;padding: 2px 10px;
                                border-radius: 10px;margin: 17px 0px 0px;width: auto;max-width: 86%;">
                                    <p style="font-family: 'Poppins', sans-serif;color: #000000;font-weight: 500;font-size: .90rem;word-break: break-word;display: flex;margin-bottom: 5px;"><span style="color: #4a7d93;min-width: 80px;padding-right: 12px;">Username: </span> ${username}</p>
                                    <p style="font-family: 'Poppins', sans-serif;color: #000000;font-weight: 500;font-size: .90rem;word-break: break-word;display: flex;margin-top: 5px;"><span style="color: #4a7d93;min-width: 80px;padding-right: 12px;">Password:</span> ${password}</p>                           
                                    <p style="font-family: 'Poppins', sans-serif;color: #000000;font-weight: 500;font-size: .90rem;word-break: break-word;display: flex;margin-top: 0px;margin-bottom: 5px;"><span style="color: #4a7d93;min-width: 80px;padding-right: 12px;">URL:</span> <a href="http://192.168.100.75:4075">http://192.168.100.75:4075</a></p>
                                </div>                      
                        </td>
        
                        <td style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  line-height: 130%; padding-right: 6.25%; padding-top: 25px;text-align: right;  width: 40%" class="header">
                            <img width="310" border="0" vspace="0" hspace="0" style="margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; width:100%" src="https://i.ibb.co/4pwqSfm/emial-otp.png" />
                        </td>
                    </tr>                
        
                    <tr>
                        <td align="center" valign="middle" style="padding-left: 6.25%; text-align: left; padding-bottom: 40px;">
                            <p style="display: block;margin-top: 30px;font-family: 'Poppins', sans-serif;display: flex;align-items: center;"><img style="margin-right: 10px;" width="40" src="https://i.ibb.co/LpjwgtW/email-hand.png"><span style="color:#4a7d93;font-size: 1rem;">Thank you!<br/><b style="color: #022640;margin-top: 8px;display: block;">EEPL Team</b></span></p>
                            <img src="https://i.ibb.co/YNrmRDt/echelon-logo.png" width="110">
                        </td>
                    </tr>
        
                </table>
        
        </td></tr></table>
        
        </body>
        </html>`

    } catch {
        return `Email :${username} , Password:${password}`
    }
}


// used for get user list
userCtrl.getUserList = async (req, res) => {
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
                `BEGIN get_user_list_new(:param_page,:param_size,:param_searchBy,:param_sortType,:param_sortBy,:P_CURSOR,:Q_CURSOR);END;`,
                {
                    param_page: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.page },
                    param_size: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: data.size },
                    param_searchBy: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: searchBy },
                    param_sortType: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: sortType },
                    param_sortBy: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: sortBy },
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


// used for get user profile details 
userCtrl.getUserProfileDetails = async (req, res) => {
    try {
        oracledb.fetchAsString = [oracledb.CLOB];
        let data = req.payload.USER_ID;
        if (!data) {
            res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "User Id is required." }]));
        }
        else {
            const result = await dbCon.execute(
                `BEGIN get_user_profile_details(:user_id,:CUR_DATA);END;`,
                {
                    user_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: req.payload.USER_ID },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }

                },


                {});
            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
            res.end(commonFunction.getSuccessResponse(finalData, '', 'user profile details fetch Successfully'));
        }

    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }


}


userCtrl.refreshToken = async (req, res) => {
    try {
        const data = req.query;
        let tokenExpiryTime = req.payload.exp;
        let oldDate = new Date(0).setUTCSeconds(tokenExpiryTime);
        if (data.key === 'event') {
            if ((oldDate - new Date().getTime()) / 1000 <= 480) {
                let option = [{
                    USER_ID: req.payload.USER_ID,
                    USER_NAME: req.payload.USER_NAME,
                    USER_EMAIL: req.payload.USER_EMAIL,
                    USER_ROLE: req.payload.USER_ROLE,
                }]
                let token = auth.generateToken(option, req.headers.session);
                res.end(JSON.stringify({ "err": '', token: token }));
            } else {
                res.end(JSON.stringify({ "err": 'X', msg: "Current token is still active. New token cant be generated now." }));
            }
        } else {
            if ((oldDate - new Date().getTime()) / 1000 <= 120) {
                let option = [{
                    USER_ID: req.payload.USER_ID,
                    USER_NAME: req.payload.USER_NAME,
                    USER_EMAIL: req.payload.USER_EMAIL,
                    USER_ROLE: req.payload.USER_ROLE,
                }]
                let token = auth.generateToken(option, req.headers.session);
                res.end(JSON.stringify({ "err": '', token: token }));
            } else {
                res.end(JSON.stringify({ "err": 'X', msg: "Current token is still active. New token cant be generated now." }));
            }
        }

    } catch (error) {
        console.log(error);
        res.end(JSON.stringify({ "err": 'X', "msg": "contact Developer" + error }));
    }

}


userCtrl.changePassword = async (req, res) => {
    try {
        let userId = req.body.user_id.toString();
        let userId1 = req.payload.USER_ID;
        let { newPassword, currentPassword } = req.body;
        let currentPswd = CryptoJS.AES.decrypt(currentPassword, sceretEncrypt_Decryptkey.encrypt_decryptKey);
        currentPassword = currentPswd.toString(CryptoJS.enc.Utf8);
        let newPswd = CryptoJS.AES.decrypt(newPassword, sceretEncrypt_Decryptkey.encrypt_decryptKey);
        newPassword = newPswd.toString(CryptoJS.enc.Utf8);
        const logresult = await dbCon.execute(
            `BEGIN get_user_pswd_log(:user_id,:user_pswd,:CUR_DATA);END;`,
            {
                user_id: { dir: oracledb.BIND_IN, val: userId },
                user_pswd: { dir: oracledb.BIND_IN, val: newPassword },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            },
            {});
        const logData = await commonFunction.getResultSet(logresult.outBinds.CUR_DATA);
        if (logData[0]?.ERR === 'X') {
            res.end(commonFunction.getLoginErrRes(logData, logData[0].ERR, logData[0].MSG));
        }
        else {
            const result = await dbCon.execute(
                `BEGIN CHANGE_PASSWORD(:P_OLD_PASSWORD,:P_NEW_PASSWORD,:P_USER_ID,:param_created_by,:Q_CURSOR); END;`,
                {
                    P_OLD_PASSWORD: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: currentPassword },
                    P_NEW_PASSWORD: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: newPassword },
                    P_USER_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId1 },
                    param_created_by: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId1 },
                    Q_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                }, {});

            const finalData = await commonFunction.getResultSet(result.outBinds.Q_CURSOR);
            if (finalData[0].ERR == 'X') {
                res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
            } else {
                res.end(commonFunction.getSuccessResponse(finalData, '', ''));
            }
        }


    } catch (error) {
        console.log(error)
        res.end(commonFunction.getErrorResponse(error));
    }
}
// used for get SSA list 
userCtrl.getSSAList = async (req, res) => {

    try {
        const result = await dbCon.execute(
            `BEGIN GET_CIRCLE_SSA_LIST(:PARAM_ZONEID,:PARAM_CIRCLEID,:CUR_DATA);END;`,
            {
                PARAM_ZONEID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.query.zone_id },
                PARAM_CIRCLEID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.query.circle_id },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        res.end(commonFunction.getSuccessResponse(finalData, '', 'SSA List Fetch Successfully'));

    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }


}

// GET_UPDATE_LOGIN_FLAG
// userCtrl.fetchLoginFlag = async (req, res) => {
//     let proc_flag = 0
//     try {
//         const { client } = await dbConnection;

//         await client.query('BEGIN');

//         // await client.query('CALL USER_LOGIN($1, $2, $3, $4)', [userName, decryptedPassword, 'CUR_DATA', 'P_CURSOR']);
//         await client.query(`
//             CALL get_update_login_flag(
//                 $1::varchar,
//                 $2::bigint,
//                 $3::int,
//                 $4::int,
//                 $5::refcursor
//             )
//         `, ['superadmin', null, null, 0, 'CUR_DATA']);

//         const curDataRes = await client.query('FETCH ALL IN "CUR_DATA"');
//         const finalData = curDataRes.rows;

//         // const pCursorRes = await client.query('FETCH ALL IN "P_CURSOR"');
//         console.log(finalData);
//         // return;

//         const permData = pCursorRes.rows;

//         // await client.query('COMMIT');

//     }
//     catch (error) {
//         console.log(error)
//     }


// }


userCtrl.fetchLoginFlag = async (req, res) => {
    let client;
    try {
        // Get database connection
        const db = await dbConnection;
        client = db.client;

        // Start transaction
        await client.query('BEGIN');

        // Call the stored procedure
        await client.query(`CALL get_update_login_flag( $1,$2,$3,$4,$5) `, ['superadmin', null, null, 0, 'mycursor']);

        // Fetch data from the cursor
        const curDataRes = await client.query('FETCH ALL IN "mycursor"');

        // // Commit the transaction
        // await client.query('COMMIT');

        // Extract rows from the result
        const finalData = curDataRes.rows;

        // const finalData = await commonFunction.getResultSet(curDataRes.rows);


        res.end(commonFunction.getSuccessResponse(finalData, '', 'Login flag Fetch Successfully'));




        // Send response
        // res.json(finalData);
    } catch (error) {
        // Roll back transaction on error
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Error in fetchLoginFlag:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // Release the client back to the pool
        if (client) {
            await client.release();
        }
    }
};



userCtrl.update_loginFlag = async (req, res) => {



    try {
        const result = await dbCon.execute(
            `BEGIN GET_UPDATE_LOGIN_FLAG(:P_USERNAME,:P_USERID,:P_LOGIN_FLAG,:P_PROC_FLAG,:CUR_DATA);END;`,
            {
                P_USERNAME: { dir: oracledb.BIND_IN, val: '' },
                P_USERID: { dir: oracledb.BIND_IN, val: req.body.USERID },
                P_LOGIN_FLAG: { dir: oracledb.BIND_IN, val: req.body.LOGIN_FLAG },
                P_PROC_FLAG: { dir: oracledb.BIND_IN, val: req.body.PROC_STATUS },
                //PARAM_CIRCLEID: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.query.circle_id },
                CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },

            },
            {});

        const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);
        if (flag == 1)
            res.end(commonFunction.getSuccessResponse(finalData, '', 'Login flag Fetch Successfully'));

    } catch (error) {
        res.end(commonFunction.getErrorResponse(error));
    }


}



function normalizeKeys(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc[key.toUpperCase()] = obj[key];
        return acc;
    }, {});
}

function updateValues(obj) {
    for (let key in obj) {
        if (obj[key] === '-1') {
            obj[key] = 'All';
        }
    }
    return obj;
}

function trimObject(obj) {
    const trimmedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const trimmedKey = key.trim();
            const trimmedValue = typeof obj[key] === 'string' ? obj[key].trim() : obj[key];
            trimmedObj[trimmedKey] = trimmedValue;
        }
    }
    return trimmedObj;
}


function transformKeys(obj, mapping) {
    const newObj = {};
    for (const key in obj) {
        if (mapping.hasOwnProperty(key)) {
            newObj[mapping[key]] = obj[key];
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}


// Function to find common keys and compare their values
function compareCommonKeysAndValues(changedData, prevData) {
    //const normalizedchangedData = normalizeKeys(changedData);
    //const normalizedprevData = normalizeKeys(prevData);

    const normalizedChangedData = trimObject(normalizeKeys(changedData));
    const normalizedPrevData = trimObject(normalizeKeys(prevData));

    const changedKey = Object.keys(normalizedChangedData);
    const prevDatakey = Object.keys(normalizedPrevData);
    // Find common keys
    const commonKeys = changedKey.filter(key => prevDatakey.includes(key));

    // Compare values for common keys
    const result = commonKeys.every(key => normalizedChangedData[key] == normalizedPrevData[key]);
    return result;


}


function generateSequenceForKey(data, key) {


    // Check if the key value is '-1'
    if (data[key] == '-1') {
        data[key] = '-1';
        return;
    }

    // Split the input string by comma and map to numbers
    const parts = data[key].split(',').map(Number);
    if (parts.length === 1) {
        return;
    }

    // Sort the parts array
    parts.sort((a, b) => a - b);

    // Convert the sorted array back to a comma-separated string
    data[key] = parts.join(',');
}

// Function to update the data object
function updateDataObject(data) {
    ['type', 'zone', 'ssa', 'circle'].forEach((e) => {
        data[e] = data[e]?.split(',').map(e => +e).sort((a, b) => a - b).toString()
    })
    return data;
}



// api of add update report creation 
userCtrl.addUpdateReport = async (req, res) => {
    try {

        let reportData = CryptoJS.AES.decrypt(req.body.obj, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        let parseReportData = JSON.parse(reportData);
        const { REPOID, REPO_NAME, REPO_HEADER, QUERY, PROCESS_TYPE, EXECUTION_TYPE, PARENT_TYPE_ID, TYPE_ID, FILTER_TYPE, FILTER_FIELDS, REPORT_CIRCLE, REPORT_BA, OUTPUT, STATUS, IS_QUERY_BASED } = parseReportData;
        let data_obj = [
            { REPOID: [/^.{1,100}$/, 0, 1] },
            { REPO_NAME: [singleSpaceValidation, 1, ""] },
            { REPO_HEADER: [singleSpaceValidation, 1, ""] },
            { QUERY: [/^.{1,4000}$/, 1, ""] },
            { PROCESS_TYPE: [/^.{1,100}$/, 1, ""] },
            { EXECUTION_TYPE: [/^.{1,100}$/, 1, ""] },
            { PARENT_TYPE_ID: [/^.{1,100}$/, 1, 1] },
            { TYPE_ID: [/^.{1,100}$/, 1, 1] }
        ];

        let repoFolderName;
        if (!REPOID) {
            const reportPath = await dbCon.execute(
                `BEGIN GET_REPORT_PATH(:TYPE_ID,:PARENT_ID,:CUR_DATA);END;`,
                {
                    TYPE_ID: { dir: oracledb.BIND_IN, val: TYPE_ID },
                    PARENT_ID: { dir: oracledb.BIND_IN, val: PARENT_TYPE_ID },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                },
                {}
            );
            const repoData = await commonFunction.getResultSet(reportPath.outBinds.CUR_DATA);
            repoFolderName = `${repoData[0].PARENT_NAME.replace(" ", "_")}/${repoData[0].TYPE_NAME.replace(" ", "_")}`;
        }

        const usr = parseJwt(req.headers.authorization);
        const created_updateBy = usr.USER_ID;

        let query = QUERY.toLowerCase();
        const preventKeys = query.includes("parallel");
        const circleKey = query.includes("#circle");
        const baKey = query.includes("#ba");
        const reportCircle = REPORT_CIRCLE == true ? 1 : 0;
        const reportBa = REPORT_BA == true ? 1 : 0;

        // Filter Type 1 Validation
        if (FILTER_TYPE == "1") {
            const isFilterFieldsEmpty = !FILTER_FIELDS || FILTER_FIELDS === "[]";
            const isCircleInvalid = !REPORT_CIRCLE || REPORT_CIRCLE === "" || REPORT_CIRCLE === "0";
            const isBAInvalid = !REPORT_BA || REPORT_BA === "" || REPORT_BA === "0";

            if (isFilterFieldsEmpty && isCircleInvalid && isBAInvalid) {
                return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Invalid circle, BA data, or filter fields." }]));
            }

            if (!isBAInvalid && isCircleInvalid) {
                return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Please check circle or BA filter value." }]));
            }

            if (isCircleInvalid && isFilterFieldsEmpty) {
                return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Invalid circle, BA data, or filter fields." }]));
            }
        }

        // Query Validation
        if (PROCESS_TYPE === "2" && !query.startsWith("select") && (query.startsWith("drop") || query.startsWith("delete"))) {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "Procedure cannot start with DROP or DELETE keyword!" }));
        }
        else if ((PROCESS_TYPE === "2" && EXECUTION_TYPE === "2") || (PROCESS_TYPE === "2" && FILTER_TYPE === "1") || (EXECUTION_TYPE === "1" && FILTER_TYPE === "1")) {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "Please enter valid data." }));
        }

        if (preventKeys) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "PARALLEL keyword is not allowed in query field." }]));
        }

        if (PROCESS_TYPE === "1" && !query.startsWith("select")) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Query can only start with SELECT keyword!" }]));
        }
        // Filter Type 0 Validation
        if (FILTER_TYPE == "0") {
            const isBAOrCircleTrueOrOne = REPORT_BA === true || REPORT_BA === "1" || REPORT_CIRCLE === true || REPORT_CIRCLE === "1";
            if (isBAOrCircleTrueOrOne) {
                return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "You cannot proceed without changing filter values." }]));
            }
        }
        if ((REPORT_BA === "0" || REPORT_BA === false || REPORT_BA === "" || REPORT_BA === 0) && baKey === true) {
            return res.end(commonFunction.getErrorResponse([{ "ERR": "X", "MSG": "Please enter valid data." }]));
        }
        // Permissions Validation
        const userPerm = CryptoJS.AES.decrypt(req.headers.permission, sceretEncrypt_Decryptkey.encrypt_decryptKey).toString(CryptoJS.enc.Utf8);
        const parsedModules = JSON.parse(JSON.parse(userPerm).MODULES);
        const module = parsedModules.find(item => item.module_id === 19);

        if (!REPOID && module.CREATE_ACCESS == 0) {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "You don't have permissions to create a report." }));
        }

        if (REPOID && module.EDIT_ACCESS == 0) {
            return res.end(commonFunction.getErrorResponse({ "ERR": "X", "MSG": "You don't have permissions to edit a report." }));
        }

        // Custom Validations
        const validation = userCtrl.customValidationsEncryptDecryption(parseReportData, res, data_obj);
        if (validation === 0) {
            const result = await dbCon.execute(
                `BEGIN ADD_UPDATE_REPORT_FORM(:REPOID,:REPO_NAME,:TYPE_ID,:PARENT_TYPE_ID,:REPO_HEADER,:IS_QUERY_BASED,:QUERY,:FILTERS,:STATUS,:PROCESS_TYPE,:EXECUTION_TYPE,:FILTER_TYPE,:REPORT_CIRCLE,:REPORT_BA,:REPORT_FORMAT,:OUTPUT,:REPORT_CREATED_BY,:REPORT_UPDATED_BY,:REPORT_FOLDER,:CUR_DATA);END;`,
                {
                    REPOID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: REPOID },
                    REPO_NAME: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: REPO_NAME },
                    TYPE_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: TYPE_ID },
                    PARENT_TYPE_ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: PARENT_TYPE_ID },
                    REPO_HEADER: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: REPO_HEADER },
                    IS_QUERY_BASED: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: IS_QUERY_BASED },
                    QUERY: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: QUERY },
                    FILTERS: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: FILTER_FIELDS },
                    STATUS: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: STATUS },
                    PROCESS_TYPE: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: PROCESS_TYPE },
                    EXECUTION_TYPE: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: EXECUTION_TYPE },
                    FILTER_TYPE: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: FILTER_TYPE },
                    REPORT_CIRCLE: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: reportCircle },
                    REPORT_BA: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: reportBa },
                    REPORT_FORMAT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: FILTER_FIELDS },
                    OUTPUT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: OUTPUT },
                    REPORT_CREATED_BY: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: created_updateBy },
                    REPORT_UPDATED_BY: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: created_updateBy },
                    REPORT_FOLDER: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repoFolderName },
                    CUR_DATA: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                }
            );

            const finalData = await commonFunction.getResultSet(result.outBinds.CUR_DATA);

            if (finalData[0].ERR == 'X') {
                return res.end(commonFunction.getErrorResponse(finalData, finalData[0].ERR, finalData[0].MSG));
            } else {
                return res.end(commonFunction.getSuccessResponse(finalData, '', finalData[0].MSG));
            }
        } else {
            return res.end(commonFunction.getErrorResponse(validation));
        }
    } catch (error) {
        //console.log(error);
        return res.end(commonFunction.getErrorResponse(error.toString()));
    }
};


module.exports = userCtrl;