/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 13/04/2023
 * Author:Kajal Gulyani
 * Contact: Echelon Edge BSNL CONS MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */

"use strict"

const oracledb = require('oracledb');
//oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_3' });
const config = require('../../../config.json');

// used for connect with toad oracle

//oracledb.poolTimeout = 600;
let connection;
const { Pool } = require('pg'); // PostgreSQL client
const dbConnection = new Promise((resolve, reject) => {
    try {
        const pool = new Pool({
            user: 'postgres',
            password: 'India@123',
            host: 'localhost',
            port: 5432,
            database: 'MIS',
            max: 20 // same as poolMax in Oracle
        });

        pool.connect((err, client, release) => {
            if (err) {
                console.error("ERROR: ", new Date(), ": pool.connect() callback: " + err.message);
                reject(err);
            } else {
                console.log("✅ PostgreSQL database connected - " + new Date());
                resolve({ client, release, pool }); // return client and release function
            }
        });

    } catch (e) {
        console.error("ERROR: ", e);
        reject(e);
    }
});

// new Promise((resolve, reject) => {
//     try {
//         connection = oracledb.createPool({
//             user: config.USER,
//             password: config.PASSWORD,
//             connectionString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${config.HOST})(PORT=${config.PORT}))(CONNECT_DATA=(SERVER=DEDICATED)(SID=${config.DATABASE})))`,
//             poolMax: 20
//         }, async function (err, pool) {
//             if (err) {
//                 console.log("ERROR: ", new Date(), ": createPool() callback: " + err.message);
//                 reject(err);
//             } else {
//                 pool.getConnection((err, conectionval) => {
//                     // console.log(err, conectionval);
//                     if (err) {
//                         // console.log("Database connection error-" + ' ', err);
//                         reject(err);
//                     } else {
//                         console.log("Database connected-" + ' ' + new Date());
//                         resolve(conectionval);
//                     }
//                 })
//             }
//         });

//     } catch (e) {
//         console.log("error", e);
//         reject(e);
//     }
// })
// function () {
//     return new Promise((resolve, reject) => {
//         try {
//             connection = oracledb.createPool({
//                 user: config.USER,
//                 password: config.PASSWORD,
//                 connectionString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${config.HOST})(PORT=${config.PORT}))(CONNECT_DATA=(SERVER=DEDICATED)(SID=${config.DATABASE})))`,

//             }, async function (err, pool) {
//                 if (err) {
//                     console.log("ERROR: ", new Date(), ": createPool() callback: " + err.message);
//                     reject(err);
//                 } else {
//                     pool.getConnection((err, conectionval) => {
//                         // console.log(err, conectionval);
//                         if (err) {
//                             // console.log("Database connection error-" + ' ', err);
//                             reject(err);
//                         } else {
//                             console.log("Database connected-" + ' ' + new Date());
//                             resolve(conectionval);
//                         }
//                     })
//                 }
//             });

//         } catch (e) {
//             console.log("error", e);
//             reject(e);
//         }
//     })

// }


module.exports = { dbConnection };