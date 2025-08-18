/*
* Project Name: Edge MIS.
* Date: 24/04/2023
* Contact: EEPL MIS Development Team.
* Copyright: EEPL
* Author: Rahul Kumar
*/
"use strict"
/**
 * Module dependencies.
 */
const jwt = require('jsonwebtoken');
const common = require('../../../config.json');
const connection = require('../CommonFiles/connection').dbConnection;
const oracledb = require('oracledb');
var dbCon;
var myCon = connection.then((connection) => {
    dbCon = connection;
});
/**
 * Global varaiable.
 */
let auth = {};
var JWTSecretKey = common.JWTSecretKey;
/**
 * Generate JWT here.
 * @Developer Rahul Kumar
 */
auth.generateToken = (option) => {
    return jwt.sign({
        USER_ID: option[0].USER_ID,
        USER_NAME: option[0].USER_NAME,
        USER_EMAIL: option[0].USER_EMAIL,
        USER_ROLE: option[0].USER_ROLE,
    }, JWTSecretKey, { expiresIn: common.SESSION_TIME });
}

/**
 * Verify JWT here
 *  @Developer Rahul kumar
 */
auth.verifyAuthToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (typeof token !== 'undefined') {
            token = token.split(" ")[1];
            let decoded = jwt.verify(token, JWTSecretKey);
            req.payload = decoded;
            next();
        } else {
            res.status(401).json({ msg: "Unauthorized request" });
        }
    } catch (error) {
        //let usr = parseJwt(req.headers.authorization);
        //let userId = usr.USER_ID;


        //console.log(created_updateBy, "created_updateBycreated_updateBy")
        if (error.message === 'jwt expired') {

            // const result = await dbCon.execute(
            //     `update user_details set LOGIN_FLAG=0 where USER_ID=${userId}`);

            res.status(401).json({ ERR: "X", msg: "Your Session has been expired." });

        } else {
            res.status(401).json({ msg: "Your session is expired" });
        }
    }
}


// function parseJwt(token) {
//     return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
// }




module.exports = auth;